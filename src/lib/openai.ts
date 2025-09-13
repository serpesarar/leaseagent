import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function categorizeMaintenanceRequest(title: string, description: string): Promise<string> {
  try {
    const prompt = `
Categorize this maintenance request into one of these categories with a specific subcategory:

Categories:
- Plumbing (subcategories: Leak, Clog, Installation, Repair)
- Electrical (subcategories: Outlet, Lighting, Wiring, Appliance)
- HVAC (subcategories: Heating, Cooling, Ventilation, Filter)
- Appliance (subcategories: Refrigerator, Washer, Dryer, Dishwasher, Stove)
- Structural (subcategories: Wall, Floor, Ceiling, Door, Window)
- Pest Control (subcategories: Insects, Rodents, Prevention)
- Cleaning (subcategories: Deep Clean, Carpet, Window, General)
- Security (subcategories: Locks, Alarm, Camera, Access)
- Landscaping (subcategories: Lawn, Garden, Tree, Irrigation)
- General Maintenance (subcategories: Paint, Hardware, Misc)

Title: ${title}
Description: ${description}

Respond with only the category and subcategory in this format: "Category - Subcategory"
`

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      temperature: 0.3,
    })

    return completion.choices[0]?.message?.content?.trim() || 'General Maintenance - Misc'
  } catch (error) {
    console.error('Error categorizing maintenance request:', error)
    return 'General Maintenance - Misc'
  }
}

export async function generateMaintenanceEstimate(title: string, description: string, category: string): Promise<number> {
  try {
    const prompt = `
Based on this maintenance request, provide a cost estimate in USD for New York City area:

Title: ${title}
Description: ${description}
Category: ${category}

Consider typical labor costs, materials, and complexity. Respond with only a number (no currency symbol or text).
`

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      max_tokens: 20,
      temperature: 0.3,
    })

    const estimate = parseFloat(completion.choices[0]?.message?.content?.trim() || '100')
    return isNaN(estimate) ? 100 : Math.max(50, Math.min(2000, estimate)) // Clamp between $50-$2000
  } catch (error) {
    console.error('Error generating maintenance estimate:', error)
    return 150 // Default estimate
  }
}

