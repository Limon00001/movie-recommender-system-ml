# Movie Recommendation System

A content-based movie recommendation engine that analyzes movie metadata and suggests similar films using machine learning techniques.

## 📋 Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Output Files](#output-files)
- [Example Output](#example-output)

## 🎯 Overview

This project implements a **content-based filtering recommendation system** that recommends movies similar to a given movie title. Unlike `collaborative filtering` (which uses user behavior), this system analyzes movie features such as genres, keywords, cast, crew, and overview text to find movies with similar characteristics.

The system processes raw movie data, extracts meaningful features, vectorizes the text content, and computes similarity scores to generate personalized recommendations.

## 🔧 How It Works

### Fundamental Concepts

**Content-Based Filtering**: Recommends items similar to what the user has already liked by comparing item features.

**TF-IDF (Term Frequency-Inverse Document Frequency)**: Converts text into numerical vectors, giving higher weight to important words.

**Cosine Similarity**: Measures similarity between two vectors (movies) on a scale of 0 to 1, where 1 means identical.

### Step-by-Step Process

#### 1. **Data Loading & Merging**
- Loads two CSV datasets: `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv`
- Merges datasets on the `title` column to combine movie information with cast and crew details

#### 2. **Data Cleaning**
- Selects relevant columns: `id`, `title`, `genres`, `keywords`, `overview`, `cast`, `crew`
- Removes rows with missing values
- Handles duplicate entries

#### 3. **Feature Extraction**
- **Genres**: Extracts movie genres from JSON-formatted strings
- **Keywords**: Extracts movie keywords/tags
- **Cast**: Extracts top 3 actors only (to focus on major cast members)
- **Crew**: Extracts only the director name
- **Overview**: Splits movie description into individual words

#### 4. **Text Preprocessing**
- Removes spaces from all text features to create single tokens
- Concatenates all features into a single `tags` column
- Converts text to lowercase for uniformity
- Applies **Porter Stemming** to reduce words to their root forms (e.g., "running" → "run")

#### 5. **Vectorization**
- Uses **CountVectorizer** to convert text into numerical vectors
- Creates a 5000-dimensional feature matrix (max 5000 most important words)
- Removes common English stop words ("the", "is", "and", etc.)

#### 6. **Similarity Computation**
- Calculates **cosine similarity** between all movie vectors
- Creates a similarity matrix where each cell represents similarity between two movies

#### 7. **Recommendation Generation**
- For a given movie, fetches its similarity scores with all other movies
- Sorts movies by similarity score in descending order
- Returns top 5 most similar movies (excluding the input movie itself)

## ✨ Key Features

- **Content-Based Analysis**: Analyzes multiple movie attributes (genres, keywords, cast, director, overview)
- **Advanced Text Processing**: Uses stemming and stop-word removal for better accuracy
- **Fast Similarity Matching**: Precomputed similarity matrix enables instant recommendations
- **Scalable Architecture**: Supports large movie datasets efficiently
- **Persistent Storage**: Saves processed data and similarity matrix for quick retrieval

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Python 3** | Programming language |
| **Pandas** | Data manipulation and analysis |
| **NumPy** | Numerical computations |
| **scikit-learn** | Machine learning (vectorization, similarity) |
| **NLTK** | Natural Language Processing (stemming) |
| **Google Colab** | Cloud-based execution environment |
| **Pickle** | Model serialization |

## 📦 Installation

### Requirements
- Python 3.7+
- Google Colab environment (or local Python with required libraries)

### Setup Steps

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd <project_directory>
   ```

2. **Install dependencies** (if running locally)
   ```bash
   pip install pandas numpy scikit-learn nltk
   ```

3. **Prepare datasets**
   - Download `tmdb_5000_movies.csv` and `tmdb_5000_credits.csv` from [Kaggle](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata?resource=download)
   - Place them in Google Drive or local directory
   - Update file paths in the notebook as needed

4. **Download NLTK data** (required for stemming)
   ```python
   import nltk
   nltk.download('punkt')
   ```

## 🚀 Usage

### Running the Notebook

1. Open `movie-recommendation-system.ipynb` in Google Colab
2. Mount your Google Drive to access the datasets
3. Execute cells sequentially from top to bottom
4. Wait for data processing to complete (~2-5 minutes)

### Getting Recommendations

```python
recommended_movies('Avatar')
```

**Output:**
```
Titan A.E.
Small Soldiers
Independence Day
Ender's Game
Aliens vs Predator: Requiem
```

### Using Saved Models

After initial processing, load the pre-computed models:

```python
import pickle

new_df = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

recommended_movies('Inception')
```

## 📁 Project Structure

```
data science project/
├── movie-recommendation-system.ipynb    # Main notebook
├── README.md                             # This file
├── tmdb_5000_movies.csv                  # Movie metadata
├── tmdb_5000_credits.csv                 # Cast and crew data
├── movies.pkl                            # Processed movie data (output)
└── similarity.pkl                        # Similarity matrix (output)
```

## 📊 Output Files

### movies.pkl
- Cleaned and processed movie dataframe
- Contains: `id`, `title`, `tags`
- Used for quick data retrieval

### similarity.pkl
- Precomputed cosine similarity matrix
- Enables instant recommendations without recalculation
- Shape: (number_of_movies × number_of_movies)

## 📈 Example Output

**Input**: `recommended_movies('Avatar')`

**Output** (Top 5 Similar Movies):
1. Titan A.E.
2. Small Soldiers
3. Independence Day
4. Ender's Game
5. Aliens vs Predator: Requiem

## 🎓 Learning Outcomes

This project demonstrates:
- **Data Preprocessing**: Handling messy, unstructured movie data
- **Feature Engineering**: Extracting meaningful features from JSON and text
- **Text Vectorization**: Converting text to numerical representations
- **Machine Learning**: Applying similarity metrics for recommendations
- **Model Persistence**: Saving and loading trained models

## ⚙️ Algorithm Complexity

- **Time Complexity**: O(n × m) where n = number of movies, m = vocabulary size
- **Space Complexity**: O(n × m) for storing similarity matrix
- **Recommendation Time**: O(n log n) for sorting (negligible with precomputed matrix)

## 🔍 Limitations & Future Improvements

### Current Limitations
- Doesn't consider user ratings or preferences
- Heavy reliance on text quality in dataset
- No temporal aspect (newer movies vs. classics)
- Backend processing can be optimized and sometimes fails because of free memory of web servers

### Future Enhancements
- Implement hybrid filtering combining collaborative + content-based
- Add user rating feedback
- Include movie budget, revenue, and runtime features
- Deploy as a REST API

## 📝 Notes

- The system uses **top 3 cast members** to avoid over-weighting popular actors
- **Director name only** is extracted from crew to focus on the main creative force
- **Porter Stemming** reduces vocabulary size and improves matching accuracy

## 📧 Support

For questions or issues, refer to the inline comments in the notebook or consult the documentation above.

---

**Author**: [Monayem Hossain Limon](https://github.com/Limon00001)

**Last Updated**: 2025
