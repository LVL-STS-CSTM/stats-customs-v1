
import React from 'react';
import { FaqItem } from '../types';
import Accordion from './Accordion';
import PageHeader from './PageHeader';

interface FaqPageProps {
    faqData: FaqItem[];
}

const FaqPage: React.FC<FaqPageProps> = ({ faqData }) => {
    return (
        <div className="bg-[#E0E0E0]">
            <PageHeader page="faq" fallbackTitle="FAQs" fallbackDescription="Find quick answers to common questions." />
            
            <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="space-y-1">
                    {faqData.map((item) => (
                        <Accordion key={item.id} title={item.question}>
                            {item.answer}
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
