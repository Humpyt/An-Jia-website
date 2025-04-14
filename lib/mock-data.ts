export const mockData = {
  properties: Array(10).fill(0).map((_, i) => ({
    id: `prop-${i}`,
    title: `Luxury ${i + 1} Bedroom Apartment in ${['Kololo', 'Nakasero', 'Bukoto', 'Ntinda'][Math.floor(Math.random() * 4)]}`,
    description: `Beautiful apartment with modern amenities`,
    price: Math.floor(Math.random() * 1000000) + 500000,
    currency: 'UGX',
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    area: Math.floor(Math.random() * 200) + 50,
    location: ['Kololo', 'Nakasero', 'Bukoto', 'Ntinda'][Math.floor(Math.random() * 4)] + ', Kampala',
    views: Math.floor(Math.random() * 100),
    active: true,
    status: 'published',
    created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    property_images: Array(3).fill(0).map((_, j) => ({
      id: `img-${i}-${j}`,
      property_id: `prop-${i}`,
      image_url: `https://picsum.photos/seed/${i}${j}/800/600`,
      is_primary: j === 0
    }))
  })),
  
  neighborhoods: [
    {
      id: 'kololo',
      name: 'Kololo',
      description: 'Upscale residential area with embassies and luxury homes',
      image_url: 'https://picsum.photos/seed/kololo/800/600',
      properties_count: 4
    },
    {
      id: 'nakasero',
      name: 'Nakasero',
      description: 'Central business district with modern apartments',
      image_url: 'https://picsum.photos/seed/nakasero/800/600',
      properties_count: 3
    },
    {
      id: 'bukoto',
      name: 'Bukoto',
      description: 'Popular residential area with good amenities',
      image_url: 'https://picsum.photos/seed/bukoto/800/600',
      properties_count: 2
    },
    {
      id: 'ntinda',
      name: 'Ntinda',
      description: 'Growing suburb with modern developments',
      image_url: 'https://picsum.photos/seed/ntinda/800/600',
      properties_count: 1
    }
  ],

  inquiries: Array(5).fill(0).map((_, i) => ({
    id: `inq-${i}`,
    property_id: `prop-${Math.floor(Math.random() * 10)}`,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    message: `I am interested in this property. Please contact me.`,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  }))
}