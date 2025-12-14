import { useEffect, useState } from "react"
import Select from "react-select"
import api from "../axios/instance"
import RecommendationList from "../components/RecommendationList"

function Home() {
    const [movies, setMovies] = useState([])
    const [movie, setMovie] = useState("")
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get("/movies")
        const options = data.map((title) => ({ value: title, label: title }))
        setMovies(options)
      } catch (error) {
        console.error("Error fetching movies:", error)
      }
    }
    fetchMovies()
  }, [])

  const handleRecommend = async () => {
    if (!movie) return

    setLoading(true)
    setError("")
    setRecommendations([])

    try {
      // Make POST request to Flask backend using Axios
      const { data } = await api.post(`/recommend`, {
        movie: movie,
      })

      setRecommendations(data)
    } catch (error) {
        console.error("Error fetching recommendations:", error)
        setRecommendations(["Error fetching recommendations"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">
        🎬 Movie Recommendation System
      </h1>

      <p className="text-center text-gray-300 mb-10">
        Select a movie and get similar recommendations instantly
      </p>

      <div className="flex gap-4 justify-center mb-12">

        <div className="w-80">
          <Select
            options={movies}
            value={movie}
            onChange={setMovie}
            placeholder="Search and select a movie..."
            className="w-80 px-4 py-2 rounded-lg focus:outline-none text-white"
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1e293b",
                borderColor: "#475569",
                color: "white",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1e293b",
                color: "white",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#374151" : "#1e293b",
                color: "white",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
            }}
          />
        </div>

        <button
          onClick={handleRecommend}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
        >
          {loading ? "Loading..." : "Recommend"}
        </button>

        {/* Error */}
        {error && <p className="mt-6 text-red-400">{error}</p>}
      </div>

    <RecommendationList recommendations={recommendations} loading={loading} />
    </div>
  )
}

export default Home
