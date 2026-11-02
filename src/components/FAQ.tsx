"use client";

import React, { useState } from "react";
import { HelpCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "How do I register as a volunteer for an upcoming initiative?",
    answer:
      "Simply navigate to any upcoming event page and click 'Join Event'. If you are signed in, your RSVP is instantly recorded in our database and your profile appears in the attendees list. Admission to all CareSphere community drives is 100% free.",
    type: "arrow",
    defaultOpen: true,
  },
  {
    question: "Can I organize and host my own community drive in Dhaka?",
    answer:
      "Yes! Registered users can click 'Create Event' in the top navigation bar. Enter your initiative's title, future date, location (such as Mirpur, Dhanmondi, or Uttara), and category. You will have full ownership to update details or manage attendees from your 'Manage Events' dashboard.",
    type: "plus",
    defaultOpen: false,
  },
  {
    question: "Are social development drives on CareSphere transparent and verified?",
    answer:
      "Every initiative is hosted directly by verified community members. Organizers post specific meeting points, volunteer rosters, and logistical updates directly on the volunteer coordination discussion board.",
    type: "arrow",
    defaultOpen: false,
  },
  {
    question: "What should volunteers bring to field events?",
    answer:
      "Essential distribution materials (such as warm blankets, medical test kits, or saplings) are provided by the event organizers. Volunteers are advised to bring personal water bottles, comfortable attire, and positive energy!",
    type: "plus",
    defaultOpen: false,
  },
  {
    question: "Can I cancel my RSVP if my schedule changes?",
    answer:
      "Yes. You can cancel your RSVP at any time directly from the Event Details page or your personal 'Joined Events' dashboard with a single tap, ensuring organizers have accurate logistical numbers.",
    type: "arrow",
    defaultOpen: false,
  },
];

export default function FAQ() {
  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about joining, organizing, and tracking social development initiatives on CareSphere.
          </p>
        </div>

        {/* DaisyUI Collapse Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              tabIndex={0}
              className={`collapse ${
                faq.type === "arrow" ? "collapse-arrow" : "collapse-plus"
              } rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all focus:border-emerald-500/50`}
            >
              <input
                type="checkbox"
                defaultChecked={faq.defaultOpen}
                aria-label={faq.question}
              />
              <div className="collapse-title text-base sm:text-lg font-bold text-slate-900 dark:text-white pr-12">
                {faq.question}
              </div>
              <div className="collapse-content text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

