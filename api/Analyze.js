import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    try {

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // RECIBE LOS DATOS DIRECTAMENTE
        const data = req.body;

        // VALIDACIÓN BÁSICA
        if (!data.email || !data.description) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // FORMATEAR ARRAYS
        const tools = data.tools?.join(', ') || 'None';
        const languages = data.languages?.join(', ') || 'English';

        // PROMPT LIMPIO
        const prompt = `
Generate a professional OSHA Job Hazard Analysis (JHA).

COMPANY INFORMATION
-------------------
Company: ${data.company}

JOB INFORMATION
-------------------
Industry Standard: ${data.industry}
Job / Activity: ${data.activity}
Work Environment: ${data.environment}

SITE CONDITIONS
-------------------
${data.siteConditions}

Shift: ${data.shift}

EMPLOYMENT / CONTRACTOR TYPE
-------------------
${data.contractor}

TOOLS USED
-------------------
${tools}

LANGUAGES REQUIRED
-------------------
${languages}

JOB DESCRIPTION
-------------------
${data.description}

INSTRUCTIONS
-------------------
Generate:

1. Job Steps
2. Hazard Identification
3. Risk Levels
4. OSHA References
5. Recommended Controls
6. Required PPE
7. Safe Work Practices
8. Emergency Considerations

Make the report professional, OSHA-aligned, and easy to read.

Adapt the analysis according to:
- the work environment,
- site conditions,
- contractor/employment relationship,
- tools used,
- and language requirements.

Be practical, realistic, and aligned with OSHA best practices.
`;

        // CLAUDE REQUEST
        const response = await anthropic.messages.create({

            model: 'claude-sonnet-4-20250514',

            max_tokens: 2500,

            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        // RESPUESTA
        return res.status(200).json({
            success: true,
            resultado: response.content[0].text
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Error processing request',
            details: error.message
        });
    }
}
