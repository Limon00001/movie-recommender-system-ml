from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import requests
import os
import gdown

# Initialize app
app = Flask(__name__)
CORS(app)

# Load preprocessed data
movies = pickle.load(open("movies.pkl", "rb"))
# similarity = pickle.load(open("similarity.pkl", "rb"))

SIMILARITY_FILE = "similarity.pkl"
FILE_ID = "1Uf2izzF_7tAKl4RNMeX23AlzlmTGfjND" # Google Drive file ID
FILE_URL = f"https://drive.google.com/uc?id={FILE_ID}"
# https://drive.google.com/file/d/1Uf2izzF_7tAKl4RNMeX23AlzlmTGfjND/view?usp=sharing

# Download if file doesn't exist
if not os.path.exists(SIMILARITY_FILE):
    print("Downloading similarity.pkl from Google Drive...")
    gdown.download(FILE_URL, SIMILARITY_FILE, quiet=False)

# Load preprocessed data
movies = pickle.load(open("movies.pkl", "rb"))

with open(SIMILARITY_FILE, "rb") as f:
    similarity = pickle.load(f)

# Normalize movie titles for consistent matching
movies['title_norm'] = movies['title'].str.strip().str.lower()

TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

# Recommendation function
def recommend(movie):
    if movie not in movies['title'].values:
        return ["Movie not found"]
    
    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    
    recommended_titles = [movies.iloc[i[0]].title for i in movies_list]
    return recommended_titles

# API endpoint
@app.route("/recommend", methods=["POST"])
def recommend_api():
    data = request.get_json()
    movie_dict = data.get("movie", {})

    # Extract string from the React-Select object
    movie = movie_dict.get("value", "") if isinstance(movie_dict, dict) else str(movie_dict)

    # Normalize incoming movie title
    movie_norm = movie.strip().lower()

    # Check if movie exists
    if movie_norm not in movies['title_norm'].values:
        return jsonify(["Movie not found"])
    
    # Get movie index and similarity scores
    movie_index = movies[movies['title_norm'] == movie_norm].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    # Return recommended movie titles
    # recommended_titles = [movies.iloc[i[0]].title for i in movies_list]
    # return jsonify(recommended_titles)

    recommended_movies = []

    for i in movies_list:
        row = movies.iloc[i[0]]
        movie_id = row.id

        url = f"https://api.themoviedb.org/3/movie/{movie_id}"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "en-US"
        }

        res = requests.get(url, params=params).json()

        poster_path = res.get("poster_path")
        # https://image.tmdb.org/t/p/w500/onE2OosgiHdjYXPoAD62sf0XsVa.jpg

        recommended_movies.append({
            "title": row.title,
            "poster": TMDB_IMAGE_BASE + poster_path if poster_path else None
        })

    return jsonify(recommended_movies)

@app.route("/movies", methods=["GET"])
def get_movies():
    return jsonify(movies['title'].tolist())


if __name__ == "__main__":
    app.run(debug=True)
