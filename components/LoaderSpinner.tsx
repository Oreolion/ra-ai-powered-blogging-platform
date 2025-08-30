const LoaderSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-400 rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  )
}

export default LoaderSpinner
