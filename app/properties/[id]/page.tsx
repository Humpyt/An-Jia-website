import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPropertyById, incrementPropertyViews } from "@/app/actions/wordpress-properties"
import Link from "next/link"
import Image from "next/image"
import PropertyDetail from "@/components/property-detail"
import type { Property } from "@/app/types/property";
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ErrorBoundary } from "@/components/error-boundary"

// Function to enhance description using DeepSeek API
async function enhanceDescription(originalDescription: string): Promise<{ enhanced: string, summary: string }> {
  // Use the provided API key directly
  const apiKey = 'sk-de1e05e92ed048d597ae24e64deb34c6'; // DeepSeek API key

  if (!originalDescription || originalDescription.trim() === '') {
    return {
      enhanced: originalDescription,
      summary: ''
    }; // No description to enhance
  }

  const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  try {
    // First, create an enhanced version of the full description
    const enhancePayload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate copywriter. Enhance the following property description to make it more appealing and professional while maintaining accuracy."
        },
        {
          role: "user",
          content: `Enhance the following property description: \n\n${originalDescription}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    };

    // Second, create a professional summary for the property
    const summaryPayload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate copywriter. Create a concise, professional summary (2-3 sentences) that highlights the key features and selling points of this property."
        },
        {
          role: "user",
          content: `Create a professional summary for this property: \n\n${originalDescription}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    };

    // Make both API calls in parallel for efficiency
    // Use Promise.allSettled to handle partial failures
    const [enhanceResult, summaryResult] = await Promise.allSettled([
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(enhancePayload),
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }).then(res => res.json()),
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(summaryPayload),
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }).then(res => res.json())
    ]);

    // Extract results, handling potential failures
    let enhanced = originalDescription;
    let summary = '';

    if (enhanceResult.status === 'fulfilled' && enhanceResult.value.choices?.[0]?.message?.content) {
      enhanced = enhanceResult.value.choices[0].message.content.trim();
    }

    if (summaryResult.status === 'fulfilled' && summaryResult.value.choices?.[0]?.message?.content) {
      summary = summaryResult.value.choices[0].message.content.trim();
    }

    console.log("Description enhanced and summarized by DeepSeek.");

    return { enhanced, summary };

  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    // Return the original description if there's an error
    return {
      enhanced: originalDescription,
      summary: ''
    };
  }
}


type Props = {
  params: {
    id: string;
  };
};

// This function runs before the page component and can safely access params
export async function generateMetadata({ params }: Props) {
  return {
    title: `Property ${params.id} - An Jia You Xuan`,
  };
}

export default async function PropertyPage(props: Props) {
  // Use the id from props directly in async operations
  const id = props.params.id;

  // Fetch property data
  let property: Property | null = null;
  try {
    console.log('Fetching property with ID:', id)
    property = await getPropertyById(id)
    console.log('Fetched property:', property)

    // If the property is null or undefined, throw 404
    if (!property) {
      console.log('Property not found')
      notFound()
    }

    try {
      // Enhance description if possible
      let originalDescription = property.description || '';

      // If there's no description, add a sample one for testing
      if (!originalDescription || originalDescription.trim() === '') {
        originalDescription = `Alma Residences is a modern apartment complex located in the heart of Bugolobi.
        This ${property.bedrooms}-bedroom apartment offers comfortable living with ${property.bathrooms} bathrooms
        and a range of amenities including ${property.amenities.join(', ')}.`;
        console.log('Added sample description for testing:', originalDescription);
      }

      // Call DeepSeek API to enhance and summarize the description
      console.log('Calling DeepSeek API to enhance description...');
      const { enhanced, summary } = await enhanceDescription(originalDescription);
      console.log('DeepSeek API response received:', {
        originalLength: originalDescription.length,
        enhancedLength: enhanced.length,
        summaryLength: summary.length
      });

      // Store both the enhanced description and the summary
      property.description = enhanced;
      property.descriptionSummary = summary;
    } catch (descriptionError) {
      // If there's an error enhancing the description, just use the original
      console.error('Error enhancing description:', descriptionError);
      // Make sure we have a valid description even if enhancement fails
      if (!property.description) {
        property.description = `${property.title} is a ${property.bedrooms}-bedroom ${property.propertyType} located in ${property.location}.`;
      }
    }

    // Increment view count (fire and forget)
    incrementPropertyViews(id).catch(console.error)
  } catch (error) {
    console.error("Error fetching property:", error)
    if (!property) {
        notFound();
    }
  }

  // Ensure property is defined before rendering
  if (!property) {
      notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <NavLinks />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButtons />
          </div>
        </div>
      </header>

      <ErrorBoundary>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          {/* Use a key to ensure React re-renders when property changes */}
          <div key={property.id}>
            <PropertyDetail property={property} />
          </div>
        </Suspense>
      </ErrorBoundary>

      <Footer />
    </div>
  )
}
