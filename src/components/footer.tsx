import React from 'react';
import CustomAccordion from '@/components/accordion-item';
import seoContent from '@/lib/seo-content';
import TwitterButton from '@/components/twitter-button';

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8 bg-slate-100 dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10">
          <div className="md:col-span-1 flex flex-col items-left justify-start pt-10">
            <p className="inline-block font-semibold text-violet-500 mb-4">FAQ</p>
            <p className="sm:text-4xl text-3xl font-extrabold text-base-content">Frequently asked questions</p>
            <TwitterButton />
          </div>
          <div className="md:col-span-1">
            <div className="bg-slate-100 dark:bg-gray-800 rounded-lg p-4">
              {seoContent.map((item, index) => (
                <div key={index} className="bg-slate-100 dark:bg-gray-800 mb-4">
                  <CustomAccordion items={[item]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;