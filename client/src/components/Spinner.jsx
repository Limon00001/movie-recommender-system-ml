function Spinner() {
  return (
    <div className="flex justify-center items-center mt-10 gap-4">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-white">Fetching recommendations...</p>
    </div>
  )
}

export default Spinner
