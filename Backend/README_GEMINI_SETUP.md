# Gemini AI Integration Setup Guide

## Overview

This project now includes comprehensive AI-powered skin condition recommendations using Google's Gemini AI. The integration provides personalized, intelligent recommendations based on the predicted skin condition and confidence level.

## Features

### 🧠 AI-Powered Recommendations
- **Immediate Actions**: What to do right now
- **Lifestyle Recommendations**: Long-term lifestyle changes
- **Treatment Suggestions**: Over-the-counter and prescription options
- **Medical Advice**: When to see a doctor and warning signs
- **Prevention Tips**: How to prevent future occurrences
- **Urgency Assessment**: Priority levels (High/Medium/Low)

### 🎨 Enhanced User Interface
- **Summary View**: Quick overview with general advice
- **Detailed View**: Comprehensive breakdown of all recommendations
- **Visual Indicators**: Color-coded urgency levels
- **Medical Disclaimers**: Important safety information

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the `SkinOAI_Backend` directory:

```bash
# Gemini AI API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Roboflow API Key (already configured in app.py)
# ROBOFLOW_API_KEY=your_roboflow_api_key_here
```

**Important**: Replace `your_actual_gemini_api_key_here` with your real API key.

### 3. Install Dependencies

The required packages are already included in `requirements.txt`:

```bash
pip install -r requirements.txt
```

Key packages:
- `google-generativeai>=0.3.0` - Gemini AI SDK
- `python-dotenv>=1.0.0` - Environment variable management

### 4. Test the Integration

Run the backend server:

```bash
python app.py
```

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "services": {
    "roboflow": "healthy",
    "gemini": {
      "service": "gemini_recommendations",
      "status": "healthy",
      "initialized": true,
      "model_available": true
    }
  },
  "message": "All services are operational"
}
```

## API Endpoints

### Health Check
```
GET /health
```
Returns the status of all services including Gemini.

### Prediction with Recommendations
```
POST /predict
```
Returns prediction results with comprehensive AI recommendations.

**Response Format:**
```json
{
  "success": true,
  "class": "acne",
  "confidence": 0.85,
  "message": "Prediction successful",
  "recommendations": {
    "immediate_actions": [
      "Keep the affected area clean",
      "Avoid touching or picking at the area"
    ],
    "lifestyle_recommendations": [
      "Maintain a consistent skincare routine",
      "Avoid known triggers"
    ],
    "treatment_suggestions": [
      "Consider over-the-counter benzoyl peroxide",
      "Use gentle, non-comedogenic products"
    ],
    "medical_advice": {
      "when_to_see_doctor": "If symptoms persist for more than 2 weeks",
      "urgency": "medium",
      "warning_signs": [
        "Severe inflammation",
        "Signs of infection"
      ]
    },
    "prevention_tips": [
      "Regular cleansing",
      "Avoid excessive sun exposure"
    ],
    "general_advice": "Based on the AI prediction...",
    "disclaimer": "This is AI-generated advice..."
  }
}
```

## Frontend Integration

The frontend has been enhanced to display the comprehensive recommendations:

### Features:
- **Summary View**: Shows general advice with option to expand
- **Detailed View**: Complete breakdown of all recommendation categories
- **Visual Design**: Clean, organized layout with icons and color coding
- **Responsive**: Works on both mobile and desktop

### User Experience:
1. User uploads image
2. Backend processes with Roboflow + Gemini
3. Frontend displays prediction + summary recommendations
4. User can expand to see detailed recommendations
5. All recommendations include medical disclaimers

## Safety Features

### Medical Disclaimers
- All recommendations include appropriate medical disclaimers
- Users are advised to consult healthcare professionals
- AI recommendations are clearly marked as such

### Urgency Assessment
- Automatic urgency level determination
- Color-coded priority indicators
- Clear guidance on when to seek medical help

### Fallback System
- If Gemini API fails, fallback recommendations are provided
- System continues to function even without AI recommendations
- Graceful error handling throughout

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Ensure `.env` file exists in backend directory
   - Check that API key is correctly set
   - Restart the backend server

2. **"Failed to initialize Gemini service"**
   - Verify API key is valid
   - Check internet connection
   - Ensure google-generativeai package is installed

3. **"No recommendations in response"**
   - Check backend logs for Gemini errors
   - Verify API key has sufficient quota
   - Check if fallback recommendations are being used

### Debug Mode

Enable debug logging by modifying `gemini_service.py`:

```python
logging.basicConfig(level=logging.DEBUG)
```

### Health Check

Use the health endpoint to verify service status:

```bash
curl http://localhost:5000/health
```

## Security Considerations

1. **API Key Protection**
   - Never commit `.env` files to version control
   - Use environment variables in production
   - Rotate API keys regularly

2. **Medical Information**
   - All recommendations include disclaimers
   - Users are advised to consult professionals
   - No medical diagnosis claims

3. **Data Privacy**
   - Images are processed temporarily
   - No personal data is stored
   - API calls are logged for debugging only

## Performance Optimization

### Caching
- Consider implementing recommendation caching
- Cache common condition recommendations
- Reduce API calls for similar conditions

### Rate Limiting
- Monitor API usage
- Implement rate limiting if needed
- Use fallback recommendations during high usage

## Future Enhancements

### Potential Improvements
1. **Multi-language Support**: Add support for different languages
2. **Personalization**: Consider user history and preferences
3. **Image Analysis**: Use Gemini Vision for enhanced analysis
4. **Integration**: Connect with telemedicine platforms
5. **Analytics**: Track recommendation effectiveness

### Advanced Features
1. **Condition Progression**: Track changes over time
2. **Treatment Tracking**: Monitor treatment effectiveness
3. **Community Features**: Share experiences (anonymously)
4. **Expert Review**: Medical professional review system

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Test with the health endpoint
4. Verify API key and configuration

## License

This integration follows the same license as the main project. Ensure compliance with Google's Gemini API terms of service. 