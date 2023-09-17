'use client'
import React, { useState } from "react";
import SingleQuestion from "./Question";

const question = [
    {
        id: 1,
        title: "What is Clubfoot.online?",
        content: [
            {
                info: "Clubfoot.online is an online platform dedicated to connecting individuals and families affected by clubfoot. We provide a space for you to list your gently-used Ankle Foot Orthosis (AFO) systems for sale, empowering you to help others while decluttering your space.",
            },]
    },
    {
        id: 2,
        title: "What is the Ponseti method?",
        content: [
            {
                info: "The Ponseti method is a non-surgical approach for treating clubfoot in children. It involves a series of gentle manipulations and the use of AFO systems, available for sale on Clubfoot.online, to gradually correct the deformity. It's a highly effective method with proven results.",
            }]
    },
    {
        id: 3,
        title: "How can I list an AFO system for sale on Clubfoot.online?",
        content: [
            {
                info: "Listing an AFO system on Clubfoot.online is easy. Just create an account, click on Sell on site and provide the necessary details about your item. Once your listing is live, interested buyers can initiate a purchase directly through our secure platform.",
            }]
    },
    {
        id: 4,
        title: "Is it safe to buy and sell on Clubfoot.online?",
        content: [
            {
                info: "Yes, it is. We prioritize the safety and security of all transactions on Clubfoot.online. We use PayPal, a globally trusted payment solution, for all transactions. In case of any dispute, buyers and sellers can utilize PayPal's dispute resolution services for a fair resolution.",
            }]
    },
    {
        id: 5,
        title: "Can I receive email notifications for items that match my criteria?",
        content: [
            {
                info: "Certainly. On Clubfoot.online, you have the option to save your search filters. When items matching your criteria become available for sale, you will receive email notifications. This feature ensures that you never miss out on the AFO systems you're looking for.",
            }]
    },
    {
        id: 6,
        title: "How can I stay updated on the latest listings and community updates on Clubfoot.online?",
        content: [
            {
                info: "Stay informed about the latest listings and community updates on Clubfoot.online by checking our platform regularly. You can also follow us on our social media channels [FB:  https://www.facebook.com/profile.php?id=100093816635345] for getting PROMO codes.",
            }]
    },
    {
        id: 7,
        title: "Can I contribute to Clubfoot.online's mission even if I don't have an AFO system to sell?",
        content: [
            {
                info: "Absolutely. You can support Clubfoot.online's mission by spreading the word, engaging in our community, or simply encouraging others to list their AFO systems on our platform. Together, we make a significant impact.",
            }]
    },
    {
        id: 8,
        title: "How does Clubfoot.online contribute to sustainability?",
        content: [
            {
                info: "By facilitating the resale of gently-used AFO systems on Clubfoot.online, we promote sustainability by reducing waste and extending the lifecycle of these essential devices.",
            }]
    },
    {
        id: 9,
        title: "What if I have more questions or need assistance on Clubfoot.online?",
        content: [
            {
                info: "Feel free to reach out to us at [contact@clubfoot.online] on Clubfoot.online. We're here to assist you with any queries or concerns.",
            }]
    },
]

const Support = () => {
    const [questions, setQuestions] = useState(question);

    return (
        <div>
            <div className="md:w-full mt-16">
                <section className="info">
                    {questions.map((question) => (
                        <SingleQuestion key={question.id} {...question} />
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Support;
