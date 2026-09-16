import { useState, memo } from 'react';
import {
  SiFigma,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,

  SiWebflow,
  SiShopify,
  SiThreedotjs,
  SiGreensock,
  SiBlender,
  SiGooglegemini,
  SiAnthropic,
  SiZapier,
  SiMake,
  SiGoogleads,
  SiMeta,
  SiGoogleanalytics
} from 'react-icons/si';

import {
  TbRobot,
  TbSeo,
  TbChartArrows,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobeXd,
  TbBrandVscode,
  TbBrandAdobePremiere,
  TbBrandAdobeAfterEffect,
  TbBrandOpenai
} from 'react-icons/tb';

const techCategories = [
  {
    name: 'DESIGN',
    items: [
      { name: 'Adobe Photoshop', icon: TbBrandAdobePhotoshop },
      { name: 'Adobe Illustrator', icon: TbBrandAdobeIllustrator },
      { name: 'Figma', icon: SiFigma },
      { name: 'Adobe XD', icon: TbBrandAdobeXd },
    ]
  },
  {
    name: 'DEVELOPMENT',
    items: [
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'VS Code', icon: TbBrandVscode },
    ]
  },
  {
    name: 'WEB & CMS',
    items: [
      { name: 'Webflow', icon: SiWebflow },
      { name: 'Shopify', icon: SiShopify },
    ]
  },
  {
    name: '3D & MOTION',
    items: [
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'GSAP', icon: SiGreensock },
      { name: 'Blender', icon: SiBlender },
      { name: 'After Effects', icon: TbBrandAdobeAfterEffect },
      { name: 'Premiere Pro', icon: TbBrandAdobePremiere },
    ]
  },
  {
    name: 'AI & AUTOMATION',
    items: [
      { name: 'OpenAI', icon: TbBrandOpenai },
      { name: 'Gemini', icon: SiGooglegemini },
      { name: 'Claude', icon: SiAnthropic },
      { name: 'AI Automation', icon: TbRobot },
      { name: 'Zapier', icon: SiZapier },
      { name: 'Make', icon: SiMake },
    ]
  },
  {
    name: 'MARKETING & GROWTH',
    items: [
      { name: 'SEO', icon: TbSeo },
      { name: 'AEO', icon: TbSeo },
      { name: 'Google Ads', icon: SiGoogleads },
      { name: 'Meta Ads', icon: SiMeta },
      { name: 'Social Media', icon: TbChartArrows },
      { name: 'Content Marketing', icon: TbChartArrows },
      { name: 'Email Marketing', icon: TbChartArrows },
      { name: 'Analytics', icon: SiGoogleanalytics },
    ]
  }
];

const TechMarquee = () => {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative w-full overflow-hidden bg-brand-bg z-10">
      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full h-4 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 16L1440 16L1440 4C1200 10 960 0 720 6C480 12 240 2 0 8Z" fill="var(--color-section-plum)" fillOpacity="0.3" />
        </svg>
      </div>

      <section
        className="relative w-full py-8 overflow-hidden border-y border-brand-accent/15"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-full overflow-hidden whitespace-nowrap">
          <MarqueeContent paused={paused} />
          <MarqueeContent paused={paused} />
        </div>
      </section>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full h-4 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 0L1440 0L1440 12C1200 6 960 16 720 10C480 4 240 14 0 8Z" fill="var(--color-section-plum)" fillOpacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

const MarqueeContent = ({ paused }) => (
  <div
    className="flex animate-marquee shrink-0 items-center gap-12 pr-12"
    style={{ animationPlayState: paused ? 'paused' : 'running' }}
  >
    {techCategories.map((category, catIndex) => (
      <div key={`cat-${catIndex}`} className="flex items-center gap-12">
        {/* Category Header Element */}
        <div className="flex items-center justify-center">
          <span className="text-brand-accent text-sm tracking-[0.2em] font-display font-semibold whitespace-nowrap px-4 py-2 border border-brand-accent/35 rounded-full bg-brand-accent/10">
            {category.name}
          </span>
        </div>

        {/* Category Items */}
        <div className="flex items-center gap-8">
          {category.items.map((item, itemIndex) => (
            <div
              key={`item-${itemIndex}`}
              className="flex items-center gap-3 text-brand-text/60 hover:text-brand-accent transition-colors duration-300 group cursor-pointer"
            >
              <item.icon className="text-2xl group-hover:scale-110 transition-transform duration-300" />
              <span className="font-body text-lg font-medium whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Divider dot between categories */}
        <div className="w-1.5 h-1.5 rounded-full bg-brand-border mx-2"></div>
      </div>
    ))}
  </div>
);

export default memo(TechMarquee);
