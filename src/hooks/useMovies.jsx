import { useEffect, useState } from "react";

const apiKey = "a81674ed74d3af1b6fa4bf8f4f0a1e52";

export default function useMovies(query) {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [totalResults, setTotalResults] = useState(0)

    function previousPage() {
        setCurrentPage(currentPage => currentPage -1)
    }

    function nextPage() {
        setCurrentPage(currentPage => currentPage +1)
    }

    function goToPage(pageNumber) {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        if (query.length < 2) {
        setMovies([]);
        setErrMsg("");
        setTotalResults(0)
        return;
        }
        
        const controller = new AbortController();
        const signal = controller.signal
        
        async function getMovies(currentPage) { 
        try {
            setErrMsg("")
            setLoading(true)
            const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`,
            { signal: signal }
            )
            
            if (!res.ok) {
            throw new Error("Bilinmeyen bir hata oluştu!")
            }
            
            const data = await res.json();
            if (data.total_results === 0) {
            throw new Error("Film Bulunamadı.")
            }

            setMovies(data.results);
            setTotalPage(data.total_pages)
            setTotalResults(data.total_results)
            if (currentPage > totalPage) {
            setCurrentPage(1)
            return
            } else {
            null
            }
        } catch (error) {
            if (error.name == "AbortError") {
            console.log(error)
            } else {
            setErrMsg(error.message);
            }
        } finally {
            setLoading(false);
        }
        }
        
        getMovies(currentPage);
        return () => controller.abort()
    //   fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
    //     .then((res) => res.json())
    //     .then((data) => setMovies(data.results))

    }, [query, currentPage, totalPage]);

    return { movies, loading, errMsg, currentPage, totalPage, totalResults, previousPage, nextPage, goToPage }
      
}