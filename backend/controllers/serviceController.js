// Service definitions matching the frontend
const SERVICES = [
  {
    level: 'Critical',
    title: 'Critical Care Transport',
    priority: 'CRITICAL PRIORITY',
    baseFare: 250,
    responseTime: '< 3 minutes',
    description: 'Life-threatening emergencies requiring immediate advanced life support and rapid transport.',
    features: [
      'Advanced Cardiac Life Support (ACLS)',
      'Mechanical ventilation support',
      'Cardiac monitoring and defibrillation',
      'IV therapy and medication administration',
      'Trauma care and stabilization'
    ],
    examples: ['Cardiac arrest', 'Severe trauma', 'Stroke', 'Respiratory failure']
  },
  {
    level: 'High',
    title: 'Emergency Medical Services',
    priority: 'High Priority',
    baseFare: 200,
    responseTime: '< 5 minutes',
    description: 'Urgent medical conditions requiring prompt professional medical attention and transport.',
    features: [
      'Basic and Advanced Life Support',
      'Emergency medication administration',
      'Trauma assessment and treatment',
      'Respiratory support and oxygen therapy',
      'Pain management and stabilization'
    ],
    examples: ['Severe bleeding', 'Breathing difficulty', 'Chest pain', 'Severe allergic reactions']
  },
  {
    level: 'Medium',
    title: 'Medical Transport',
    priority: 'Medium Priority',
    baseFare: 150,
    responseTime: '< 10 minutes',
    description: 'Non-urgent medical transport with basic life support capabilities for stable patients.',
    features: [
      'Basic Life Support (BLS)',
      'Patient monitoring and vital signs',
      'Comfortable patient transport',
      'Medical escort services',
      'Inter-facility transfers'
    ],
    examples: ['Fractures', 'Moderate injuries', 'Stable medical conditions', 'Hospital transfers']
  },
  {
    level: 'Low',
    title: 'Routine Transport',
    priority: 'Low Priority',
    baseFare: 100,
    responseTime: '< 15 minutes',
    description: 'Scheduled medical appointments and routine hospital transfers for non-emergency situations.',
    features: [
      'Wheelchair accessible vehicles',
      'Assistance with mobility',
      'Scheduled appointment transport',
      'Basic medical supervision',
      'Comfortable and safe transport'
    ],
    examples: ['Routine transport', 'Check-ups', 'Non-emergency appointments', 'Discharge transport']
  }
];

// Additional services
const ADDITIONAL_SERVICES = [
  {
    icon: '🏥',
    title: 'Inter-Hospital Transfers',
    description: 'Safe and efficient transfers between medical facilities with appropriate medical supervision.'
  },
  {
    icon: '🩺',
    title: 'Event Medical Coverage',
    description: 'On-site medical support for events, sports competitions, and public gatherings.'
  },
  {
    icon: '❤️',
    title: 'Cardiac Care Transport',
    description: 'Specialized cardiac monitoring and support during transport for heart patients.'
  },
  {
    icon: '🚑',
    title: 'Critical Care Transfers',
    description: 'Advanced life support for ICU patient transfers with specialized medical equipment.'
  },
  {
    icon: '♿',
    title: 'Wheelchair Transport',
    description: 'Non-emergency wheelchair accessible transport for medical appointments.'
  },
  {
    icon: '✈️',
    title: 'Air Medical Coordination',
    description: 'Coordination with helicopter and air ambulance services for critical emergencies.'
  }
];

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    res.json({
      message: 'Services retrieved successfully',
      services: SERVICES,
      additionalServices: ADDITIONAL_SERVICES
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get service by level
exports.getServiceByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    
    const service = SERVICES.find(s => s.level.toLowerCase() === level.toLowerCase());
    
    if (!service) {
      return res.status(404).json({ 
        error: 'Service not found. Valid levels: Critical, High, Medium, Low' 
      });
    }
    
    res.json({
      message: 'Service retrieved successfully',
      service
    });
  } catch (error) {
    console.error('Get service by level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
