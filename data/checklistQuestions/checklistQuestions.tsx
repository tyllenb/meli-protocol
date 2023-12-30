export const checklistQuestions = [
    {
      category: "Morning Routine",
      items: [
        {
          question: "Exposure to morning sunlight within 30 minutes of waking?",
          followUpQuestions: []
        },
        {
          question: "Did you consume water shortly after waking up?",
          followUpQuestions: [
            { question: "Did you add any sea salt?", placeholder: "Place Yes or No" }
          ]
        },
        {
          question: "Did you consume caffeine within the first 90 minutes after waking?",
          followUpQuestions: [
            { question: "Times of caffeine consumption", placeholder: "Enter times" }
          ]
        }
      ]
    },
    {
      category: "Physical Health",
      items: [
        {
          question: "Did you engage in physical exercise today?",
          followUpQuestions: [
            { question: "What type of exercise did you do?", placeholder: "Type of exercise" },
            { question: "How long was your workout?", placeholder: "Enter duration in minutes" }
          ]
        },
        {
          question: "Heat exposure, like a sauna session?",
          followUpQuestions: [
            { question: "Duration of heat exposure", placeholder: "Enter duration in minutes" }
          ]
        },
        {
          question: "Cold exposure practice, like cold showers or ice baths?",
          followUpQuestions: [
            { question: "Duration of cold exposure", placeholder: "Enter duration in minutes" }
          ]
        }
      ]
    },
    {
      category: "Nutrition & Diet",
      items: [
        {
          question: "Did you follow a nutritious diet today?",
          followUpQuestions: [
            { question: "Description of meals", placeholder: "Briefly describe your meals" }
          ]
        }
      ]
    },
    {
      category: "Mental & Cognitive Health",
      items: [
        {
          question: "Did you have focused, deep work sessions today?",
          followUpQuestions: [
            { question: "Duration of longest deep work session", placeholder: "Enter duration in minutes" }
          ]
        },
        {
          question: "Did you practice mindfulness or meditation?",
          followUpQuestions: [
            { question: "Duration of session", placeholder: "Enter duration in minutes" }
          ]
        },
        {
          question: "Spend time learning something new or reading?",
          followUpQuestions: [
            { question: "Learned subject or book title", placeholder: "Subject or book title" }
          ]
        },
        {
          question: "Engage in any writing today?",
          followUpQuestions: [
            { question: "Describe briefly what you wrote about", placeholder: "Topic or summary of your writing" }
          ]
        }
      ]
    },
    {
      category: "Digital Wellbeing",
      items: [
        {
           question: "Did you spend time on digital devices for leisure (e.g., social media, video games)?",
           followUpQuestions: [
           { question: "Time spent on devices", placeholder: "Enter duration in minutes" }
          ]
        },
        {
            question: "Did you spend time in nature today?",
            followUpQuestions: [
                { question: "How long did you spend outdoors?", placeholder: "Enter duration in minutes" }
            ]
        },
      ]
    },
    {
      category: "Emotional Wellbeing",
      items: [
        {
          question: "Any meaningful social interactions today?",
          followUpQuestions: []
        },
        {
          question: "Did you practice any stress management techniques?",
          followUpQuestions: [
            { question: "Techniques used", placeholder: "Describe the techniques" }
          ]
        },
        {
          question: "Did you do any creative activities or hobbies?",
          followUpQuestions: [
            { question: "Type of activity or hobby", placeholder: "Type of activity or hobby" }
          ]
        },
        {
          question: "Did you engage in gratitude practices today? (eg. prayer, thankfulness)",
          followUpQuestions: [
            { question: "Grateful thoughts", placeholder: "Write down your thoughts" }
          ]
        }
      ]
    },
    {
      category: "Sleep Hygiene",
      items: [
        {
          question: "Avoiding caffeine 7-8 hours before bedtime?",
          followUpQuestions: []
        },
        {
          question: "Avoided bright screens at least an hour before bedtime?",
          followUpQuestions: []
        },
      ]
    }
  ];
  