import Spinner from "./Spinner"

function RecommendationList({ recommendations, loading }) {

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Recommended Movies
      </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendations.map((movie, index) => (
            <div
                key={index}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
                {movie.poster && (
                <img
                    src={movie.poster ? movie.poster : `https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg`}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                />
                )}

                <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{movie.title}</h3>
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default RecommendationList
