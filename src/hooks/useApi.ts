import { useState, useEffect } from 'react'
import { concat, append } from 'ramda'
import { ApiResponse } from 'apisauce'

export const useApi = (apiFunc, paginate = false) => {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<any>(1)
  const [total, setTotal] = useState(-1)

  const incrementPage = (response) => {
    if (
      response.data?.total >
      response.data?.data?.length + data.length
    ) {
      setPage(page + 1)
    }
  }

  const appendDataOnPagination = (response) => {
    if (response.data?.data && data.length) {
      setData(oldData => [...oldData, ...response.data?.data])
    } else setData(response.data?.data)
  }

  const nextPageSetup = (response) => {
    if (paginate) {
      setTotal(response.data?.total)
      incrementPage(response)
    }
  }

  const processData = (response) => paginate ? appendDataOnPagination(response) : setData(response.data)

  const addPage = (args) => paginate ? append(page, args) : args

  const request = async (...args) => {
    let response: ApiResponse<any>
    if (total !== data.length && !loading) {
      try {
        setError(false)
        if (loading) new Error("One request is already under process")
        if (total === data.length) new Error("No more data to fetch")
        setLoading(true)
        response = await apiFunc(...addPage(args))
        setError(!response.ok)
        processData(response)
        nextPageSetup(response)
      } catch (e) {
        console.log("Error: ", e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    return response
  }

  const resetRefresh = () => {
    resetPagination()
  }

  useEffect(() => {
    if (page === 1 && total === -1 && data?.length === 0 && paginate) {
      request()
    }
  }, [page, total, data])

  const resetPagination = () => {
    setPage(1)
    setTotal(-1)
    setData([])
  }

  const removeFromData = (server_email_id) => {
    setData(data.filter((x) => x.server_email_id !== server_email_id))
    setTotal(total - 1)
  }

  const removeFromDataById = (id) => {
    setData(data.filter((x) => x.id !== parseInt(id)))
    setTotal(total - 1)
  }

  return {
    data,
    error,
    loading,
    request,
    resetPagination,
    removeFromData,
    removeFromDataById,
    resetRefresh
  }
}
