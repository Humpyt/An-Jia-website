import { mockData } from './mock-data'

export const dataService = {
  properties: {
    getAll: () => Promise.resolve({ data: mockData.properties, error: null }),
    getById: (id: string) => Promise.resolve({ 
      data: mockData.properties.find(p => p.id === id) || null, 
      error: null 
    }),
    search: (query: string) => Promise.resolve({
      data: mockData.properties.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
      ),
      error: null
    })
  },
  neighborhoods: {
    getAll: () => Promise.resolve({ data: mockData.neighborhoods, error: null }),
    getById: (id: string) => Promise.resolve({ 
      data: mockData.neighborhoods.find(n => n.id === id) || null, 
      error: null 
    })
  },
  inquiries: {
    create: (inquiry: any) => Promise.resolve({ 
      data: { 
        ...inquiry, 
        id: `inq-${mockData.inquiries.length}`,
        created_at: new Date().toISOString()
      }, 
      error: null 
    }),
    getAll: () => Promise.resolve({ data: mockData.inquiries, error: null })
  }
}