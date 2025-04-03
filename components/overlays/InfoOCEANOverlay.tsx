'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Brain, Target, Users, Heart, AlertCircle, BookOpen, Briefcase, GraduationCap, Heart as HeartIcon, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Background from '@/components/Background';

interface InfoOCEANOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InfoOCEANOverlay({ open, onOpenChange }: InfoOCEANOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if (open) {
            // Small delay for animation to work properly
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [open]);
    
    // Handle closing with animation
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onOpenChange(false), 300); // Match transition duration
    };
    
    if (!open) return null;
    
    // Define OCEAN traits with expanded information from OCEAN.md
    const traits = [
        {
            title: "Openness",
            description: "Appreciation for art, emotion, adventure, unusual ideas, curiosity, and variety of experience.",
            icon: <Brain className="h-8 w-8" />,
            color: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
            iconColor: "text-blue-500 dark:text-blue-400",
            highTraits: [
                "Have a rich vocabulary and appreciate complex ideas",
                "Enjoy artistic and creative pursuits",
                "Are intellectually curious and enjoy philosophical discussions",
                "Tend to be more aware of their feelings and inner experiences",
                "Are more likely to try new foods, visit new places, and engage in novel activities",
                "May hold unconventional beliefs and be more politically liberal",
                "Are often described as imaginative, insightful, and original"
            ],
            lowTraits: [
                "Prefer familiarity and routine over novelty",
                "Tend to be more practical and conventional in their thinking",
                "May find abstract or theoretical concepts difficult to grasp or uninteresting",
                "Often have more traditional values and conservative viewpoints",
                "Prefer straightforward, concrete communication",
                "May be less interested in artistic or cultural pursuits",
                "Are often described as practical, traditional, and down-to-earth"
            ],
            realLifeImpact: [
                "Career Choices: High openness is associated with careers in the arts, sciences, and entrepreneurship.",
                "Academic Achievement: Openness correlates positively with academic performance in liberal arts and creative fields.",
                "Creativity and Innovation: This trait is the strongest predictor of creative achievement across domains.",
                "Political Views: Higher openness is associated with more liberal and progressive political attitudes.",
                "Adaptability to Change: People high in openness typically adapt more readily to organizational changes."
            ],
            facets: [
                "Imagination: Vivid imagination and fantasy life",
                "Artistic Interest: Appreciation for art, music, poetry, and beauty",
                "Emotionality: Awareness of and receptivity to one's own feelings",
                "Adventurousness: Willingness to try new activities and experiences",
                "Intellect: Intellectual curiosity and interest in abstract ideas",
                "Liberalism: Readiness to challenge authority and traditional values"
            ]
        },
        {
            title: "Conscientiousness",
            description: "Tendency to be organized and dependable, show self-discipline, act dutifully, aim for achievement, and prefer planned rather than spontaneous behavior.",
            icon: <Target className="h-8 w-8" />,
            color: "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800",
            iconColor: "text-green-500 dark:text-green-400",
            highTraits: [
                "Are well-organized and maintain orderly environments",
                "Plan ahead and complete tasks on time",
                "Pay attention to details and follow rules and procedures",
                "Work diligently toward their goals",
                "Are reliable, responsible, and dependable",
                "Think carefully before acting or speaking",
                "Maintain self-discipline even when tasks are challenging"
            ],
            lowTraits: [
                "May have messy or disorganized living and working spaces",
                "Tend to procrastinate and might miss deadlines",
                "Can be careless about details or rules",
                "May struggle to maintain focus on long-term goals",
                "Are more spontaneous and flexible in their approach to tasks",
                "Make decisions quickly without extensive deliberation",
                "Might leave tasks unfinished when they become difficult or boring"
            ],
            realLifeImpact: [
                "Academic and Job Performance: Conscientiousness is the strongest personality predictor of both academic achievement and job performance.",
                "Health and Longevity: More conscientious individuals tend to live longer and engage in healthier behaviors.",
                "Financial Success: Higher conscientiousness predicts better financial planning and greater stability.",
                "Relationship Stability: Conscientious individuals tend to have more stable marriages and lower divorce rates.",
                "Career Success: This trait correlates with higher income and more rapid advancement."
            ],
            facets: [
                "Competence: Belief in one's own capability and effectiveness",
                "Order: Tendency to keep things neat and organized",
                "Dutifulness: Strict adherence to standards of conduct",
                "Achievement Striving: High aspiration levels and work ethic",
                "Self-Discipline: Ability to begin tasks and carry them through to completion",
                "Deliberation: Tendency to think carefully before acting"
            ]
        },
        {
            title: "Extraversion",
            description: "Energy, positive emotions, surgency, assertiveness, sociability and the tendency to seek stimulation in the company of others.",
            icon: <Users className="h-8 w-8" />,
            color: "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800",
            iconColor: "text-yellow-500 dark:text-yellow-400",
            highTraits: [
                "Enjoy being around people and seek out social situations",
                "Are talkative and find it easy to make new friends",
                "Feel energized after spending time with others",
                "Are often described as the \"life of the party\"",
                "Express themselves confidently in groups",
                "Prefer working with others rather than alone",
                "Make decisions quickly and take risks more readily"
            ],
            lowTraits: [
                "Prefer solitary activities or one-on-one interactions",
                "Need time alone to recharge after social interactions",
                "May be perceived as quiet or reserved in group settings",
                "Think before speaking and may prefer written communication",
                "Work well independently and may prefer depth over breadth in relationships",
                "Process experiences internally before responding",
                "May avoid being the center of attention"
            ],
            realLifeImpact: [
                "Social Network Size: Extraverts typically have larger social networks and more diverse connections.",
                "Leadership Emergence: Extraverts are more likely to emerge as leaders in group settings.",
                "Job Satisfaction: Extraversion predicts higher job satisfaction in roles involving social interaction.",
                "Subjective Well-Being: Extraverts report higher levels of happiness and life satisfaction on average.",
                "Career Choice: Extraverts tend to gravitate toward careers involving social interaction."
            ],
            facets: [
                "Warmth: Friendliness and affectionate nature toward others",
                "Gregariousness: Preference for the company of others",
                "Assertiveness: Social dominance and forcefulness of expression",
                "Activity: Pace of living and level of energy",
                "Excitement-Seeking: Need for environmental stimulation",
                "Positive Emotions: Tendency to experience positive emotions"
            ]
        },
        {
            title: "Agreeableness",
            description: "Tendency to be compassionate and cooperative rather than suspicious and antagonistic towards others.",
            icon: <Heart className="h-8 w-8" />,
            color: "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800",
            iconColor: "text-pink-500 dark:text-pink-400",
            highTraits: [
                "Show genuine concern for others' well-being",
                "Are cooperative and seek to maintain harmony",
                "Give people the benefit of the doubt",
                "Are willing to compromise their own needs for others",
                "Forgive easily and rarely hold grudges",
                "Speak tactfully and avoid confrontation",
                "Are described as kind, sympathetic, and warm"
            ],
            lowTraits: [
                "Are more concerned with self-interest than others' needs",
                "Can be blunt, straightforward, and sometimes critical",
                "May be skeptical of others' motives",
                "Stand firm on their positions in conflicts",
                "May be less willing to help others without clear benefit",
                "Can be competitive rather than cooperative",
                "Are sometimes described as challenging, detached, or analytical"
            ],
            realLifeImpact: [
                "Relationship Quality: Higher agreeableness predicts better relationship quality, particularly in close relationships.",
                "Prosocial Behavior: Agreeable individuals engage in more helping, volunteering, and charitable giving.",
                "Conflict Resolution: Higher agreeableness is associated with more constructive approaches to conflict resolution.",
                "Team Performance: In team settings, agreeableness facilitates cooperation and can enhance group performance.",
                "Leadership Style: Agreeable leaders tend to adopt more transformational and supportive leadership styles."
            ],
            facets: [
                "Trust: Belief in the honesty and good intentions of others",
                "Straightforwardness: Frankness and sincerity in expression",
                "Altruism: Active concern for the welfare of others",
                "Compliance: Tendency to defer to others in conflict situations",
                "Modesty: Tendency to be humble and self-effacing",
                "Tender-Mindedness: Sympathy and concern for others"
            ]
        },
        {
            title: "Neuroticism",
            description: "Tendency to experience unpleasant emotions easily, such as anger, anxiety, depression, and vulnerability.",
            icon: <AlertCircle className="h-8 w-8" />,
            color: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
            iconColor: "text-purple-500 dark:text-purple-400",
            highTraits: [
                "Experience frequent mood swings and negative emotions",
                "Worry about many different things",
                "React more strongly to stress and challenges",
                "May struggle with impulse control",
                "Are more self-conscious and easily embarrassed",
                "Tend to ruminate on negative experiences",
                "May be more prone to anxiety and depression"
            ],
            lowTraits: [
                "Remain calm under pressure and stress",
                "Recover quickly from negative events",
                "Are less easily upset or emotionally reactive",
                "Tend to be more relaxed and less worried",
                "Experience fewer mood fluctuations",
                "Are more emotionally resilient",
                "Generally maintain a more positive outlook"
            ],
            realLifeImpact: [
                "Mental Health: Higher neuroticism is a risk factor for various psychological disorders, including anxiety and depression.",
                "Physical Health: Neuroticism is associated with poorer physical health outcomes and susceptibility to stress-related illnesses.",
                "Coping Strategies: Individuals high in neuroticism tend to use less effective coping strategies.",
                "Job Performance: High neuroticism can negatively impact job performance, particularly in high-stress occupations.",
                "Relationship Satisfaction: Higher neuroticism is associated with lower relationship satisfaction and more conflicts."
            ],
            facets: [
                "Anxiety: Level of free-floating anxiety and tendency to worry",
                "Angry Hostility: Tendency to experience anger and related states",
                "Depression: Tendency to experience feelings of guilt, sadness, and hopelessness",
                "Self-Consciousness: Shyness or social anxiety, discomfort around others",
                "Impulsiveness: Tendency to act on cravings and urges",
                "Vulnerability: General susceptibility to stress"
            ]
        }
    ];

    // Applications of the OCEAN model in different contexts
    const applications = [
        {
            title: "Clinical Psychology",
            icon: <BookOpen className="h-6 w-6" />,
            description: "The Big Five model helps in diagnosis, treatment planning, risk assessment, and outcome prediction in mental health settings."
        },
        {
            title: "Workplace",
            icon: <Briefcase className="h-6 w-6" />,
            description: "Organizations use the OCEAN framework for personnel selection, team composition, leadership development, and career counseling."
        },
        {
            title: "Education",
            icon: <GraduationCap className="h-6 w-6" />,
            description: "Personality traits influence learning styles, academic performance, and help educators design more effective interventions."
        },
        {
            title: "Relationships",
            icon: <HeartIcon className="h-6 w-6" />,
            description: "The Big Five model provides insights into relationship dynamics, partner selection, and conflict resolution strategies."
        },
        {
            title: "Cross-Cultural",
            icon: <Sparkles className="h-6 w-6" />,
            description: "The five-factor structure has been replicated across many cultures, suggesting these personality dimensions may be universal."
        }
    ];
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[25] flex items-end justify-center" 
             onClick={handleClose}>
            <div 
                className={cn(
                    "w-full max-w-7xl h-[90vh] bg-background rounded-t-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out",
                    isVisible ? "translate-y-0" : "translate-y-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    className="absolute right-6 top-6 z-[30]"
                    onClick={handleClose}
                >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>

                <ScrollArea className="h-full w-full">
                    <div className="flex min-h-full w-full justify-center">
                        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 pt-24">

                            <Background/>

                            {/* Hero Section */}
                            <section className="text-center mb-12 sm:mb-16">
                                <div className="inline-block p-2 px-4 bg-gray-500/10 backdrop-blur-sm rounded-full text-primary font-medium mb-4">
                                    Personality Framework
                                </div>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 sm:mb-6 text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                                    Understanding <span className="text-primary">OCEAN</span> Personality Traits
                                </h1>
                                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                                    The OCEAN model, also known as the Big Five Personality Traits, helps understand personality 
                                    through five key dimensions that shape human behavior and preferences.
                                </p>
                                <p className="text-base text-muted-foreground/80 max-w-3xl mx-auto">
                                    Emerged from decades of research in the 1960s through 1990s, the Big Five model has become the dominant 
                                    paradigm in personality psychology due to its replication across cultures, stability across the lifespan, 
                                    and predictive validity for important life outcomes.
                                </p>
                            </section>

                            {/* Visual diagram of the OCEAN model */}
                            <div className="mb-12 flex justify-center">
                                <div className="w-full max-w-3xl p-6 rounded-xl border bg-card/40 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-2xl font-semibold text-center mb-6">The Five Dimensions of Personality</h2>
                                    <div className="h-1 w-32 bg-primary/50 mx-auto mb-8 rounded-full"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
                                        {['O', 'C', 'E', 'A', 'N'].map((letter, index) => (
                                            <div key={letter} className="flex flex-col items-center">
                                                <div className={`h-16 w-16 flex items-center justify-center text-3xl font-bold rounded-full ${traits[index].color} ${traits[index].iconColor} mb-2`}>
                                                    {letter}
                                                </div>
                                                <span className="text-sm font-medium">{traits[index].title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs for detailed information */}
                            <Tabs defaultValue="traits" className="mb-16">
                                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                                    <TabsTrigger value="traits">Personality Traits</TabsTrigger>
                                    <TabsTrigger value="applications">Applications</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="traits">
                                    {/* Detailed trait accordions */}
                                    <div className="grid grid-cols-1 gap-6 mb-8">
                                        {traits.map((trait, index) => (
                                            <Accordion type="single" collapsible key={trait.title}>
                                                <AccordionItem value={`trait-${index}`} className={`rounded-lg border ${trait.color}`}>
                                                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-full ${trait.iconColor} bg-white dark:bg-gray-800`}>
                                                                {trait.icon}
                                                            </div>
                                                            <div className="text-left">
                                                                <h3 className="text-xl font-semibold">{trait.title}</h3>
                                                                <p className="text-sm text-muted-foreground line-clamp-1">{trait.description}</p>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-6 pb-4">
                                                        <div className="text-muted-foreground mb-6">{trait.description}</div>
                                                        
                                                        <h4 className="font-semibold mb-2">Key Facets</h4>
                                                        <ul className="list-disc pl-5 mb-6 space-y-1 text-sm">
                                                            {trait.facets.map((facet, idx) => (
                                                                <li key={idx}>{facet}</li>
                                                            ))}
                                                        </ul>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">High {trait.title} Traits</h4>
                                                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                                                    {trait.highTraits.map((item, idx) => (
                                                                        <li key={idx}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">Low {trait.title} Traits</h4>
                                                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                                                    {trait.lowTraits.map((item, idx) => (
                                                                        <li key={idx}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        
                                                        <h4 className="font-semibold mb-2">Real-Life Impact</h4>
                                                        <ul className="list-disc pl-5 space-y-1 text-sm">
                                                            {trait.realLifeImpact.map((impact, idx) => (
                                                                <li key={idx}>{impact}</li>
                                                            ))}
                                                        </ul>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))}
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="applications">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="bg-card/50 border rounded-xl shadow-sm p-6 mb-8 backdrop-blur-sm">
                                            <h3 className="text-xl font-semibold mb-4">Applications of the Big Five Model</h3>
                                            <p className="text-muted-foreground mb-6">
                                                The OCEAN model has been applied in various domains to understand human behavior, 
                                                predict outcomes, and design more effective interventions tailored to individual differences.
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {applications.map((app, index) => (
                                                    <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow bg-background">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                                {app.icon}
                                                            </div>
                                                            <h4 className="font-semibold">{app.title}</h4>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{app.description}</p>
                                    </div>
                                ))}
                            </div>
                                        </div>
                                        
                                        <div className="bg-card/50 border rounded-xl shadow-sm p-6 backdrop-blur-sm">
                                            <h3 className="text-xl font-semibold mb-4">Interactions Between Traits</h3>
                                            <p className="text-muted-foreground mb-6">
                                                While each of the Big Five traits represents a distinct dimension of personality, 
                                                they do not operate in isolation. The interaction between traits can create unique 
                                                personality profiles and behavioral patterns.
                                            </p>
                                            
                                            <h4 className="font-semibold mb-2">Example Trait Combinations:</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>
                                                    <span className="font-medium">High Extraversion + High Agreeableness</span>: 
                                                    Particularly skilled at building and maintaining social relationships.
                                                </li>
                                                <li>
                                                    <span className="font-medium">High Conscientiousness + Low Neuroticism</span>: 
                                                    Excel in high-pressure leadership roles.
                                                </li>
                                                <li>
                                                    <span className="font-medium">High Openness + High Conscientiousness</span>: 
                                                    Combine creativity with the discipline to bring innovative ideas to fruition.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* Important Considerations */}
                            <section className="mb-16 sm:mb-20">
                                <h2 className="text-2xl font-bold mb-6 text-center">Important Considerations</h2>
                                <div className="bg-card/50 border rounded-lg p-8 max-w-3xl mx-auto shadow-sm backdrop-blur-sm">
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 items-start">
                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</span>
                                            <span>OCEAN is based on decades of personality research and is widely used in psychology. The five-factor structure has been replicated across different cultures, languages, and assessment methods.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</span>
                                            <span>Each trait exists on a spectrum - there are no &quot;good&quot; or &quot;bad&quot; scores. Different trait combinations can be advantageous in different contexts and situations.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</span>
                                            <span>Your AI companion analyzes your communication style to estimate your personality traits. These traits show moderate heritability and stability across the lifespan.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</span>
                                            <span>These insights are for educational purposes and should not replace professional psychological assessment. The OCEAN model is a general framework and individual personalities are much more complex.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
} 