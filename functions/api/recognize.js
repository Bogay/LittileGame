/**
 * Cloudflare Pages Function for OCR Recognition
 * 
 * This function acts as a proxy between the client and Google Cloud Vision API,
 * keeping the API key secure on the server side.
 * 
 * Environment Variables Required:
 * - GOOGLE_CLOUD_VISION_API_KEY: Your Google Cloud Vision API key
 */

export async function onRequestPost(context) {
  try {
    // Get the API key from environment variables
    const apiKey = context.env.GOOGLE_CLOUD_VISION_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          message: 'Please set GOOGLE_CLOUD_VISION_API_KEY in Cloudflare Pages environment variables'
        }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Parse the request body to get the image data
    const requestData = await context.request.json();
    const imageBase64 = requestData.image;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image data provided' }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Prepare the request to Google Cloud Vision API
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const requestBody = {
      "requests": [{
        "image": {
          "content": imageBase64
        },
        "features": [{
          "type": "DOCUMENT_TEXT_DETECTION",
          "maxResults": 1
        }],
        "imageContext": {
          "languageHints": ["zh-TW", "zh"]
        }
      }]
    };

    // Call Google Cloud Vision API
    const response = await fetch(visionUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    // Check for errors from the Vision API
    if (result.error) {
      console.error("Vision API Error:", result.error);
      return new Response(
        JSON.stringify({ 
          error: 'Vision API error',
          details: result.error.message 
        }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Extract the recognized text
    let recognizedText = null;
    if (result.responses && 
        result.responses[0] && 
        result.responses[0].textAnnotations && 
        result.responses[0].textAnnotations.length > 0) {
      recognizedText = result.responses[0].textAnnotations[0].description.trim().charAt(0);
    }

    // Return the result
    return new Response(
      JSON.stringify({ 
        success: true,
        text: recognizedText 
      }), 
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error("Error in recognize function:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
