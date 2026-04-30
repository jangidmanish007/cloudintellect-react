import { createContext, useContext } from 'react'

const PageContentContext = createContext({ content: {}, page: null, loading: false })

export function usePageContentContext() {
  return useContext(PageContentContext)
}

export function PageContentProvider({ content = {}, page = null, loading = false, children }) {
  const value = { content, page, loading }
  return (
    <PageContentContext.Provider value={value}>
      {children}
    </PageContentContext.Provider>
  )
}

export default PageContentContext
