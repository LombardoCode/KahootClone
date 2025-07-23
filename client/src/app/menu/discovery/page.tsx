'use client';

import DiscoverCategoryCard, { DiscoverCategoryCardSize } from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryCard";
import DiscoverCategoryWrapper from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryWrapper";
import DiscoverFeaturedCard, { DiscoverFeaturedCardSize } from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedCard";
import DiscoverFeaturedWrapper from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedWrapper";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootCard";
import DiscoverKahootWrapper from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootWrapper";
import SectionTitle, { SectionTitleSizes } from "@/app/components/utils/Discovery/Titles/SectionTitle";

export interface DiscoverCategoryCardInfo {
  title: string;
  bgImg: string;
}

export interface DiscoverKahootCardInfo {
  title: string;
  bgImg: string;
}

export interface DiscoverFeaturedCardInfo extends DiscoverKahootCardInfo {
  numberOfQuestions: number;
}

const DiscoveryMenuPage = () => {
  const categories: DiscoverCategoryCardInfo[] = [
    { title: "Math", bgImg: "/assets/discovery/CardBG.jpg" },
    { title: "Science", bgImg: "/assets/discovery/CardBG2.jpg" },
    { title: "Technology", bgImg: "/assets/discovery/CardBG3.jpg" },
    { title: "Language", bgImg: "/assets/discovery/CardBG.jpg" },
    { title: "Games", bgImg: "/assets/discovery/CardBG2.jpg" },
    { title: "Food", bgImg: "/assets/discovery/CardBG3.jpg" }
  ];

  const kahoots: DiscoverKahootCardInfo[] = [
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG.jpg" },
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG2.jpg" },
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG3.jpg" },
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG.jpg" },
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG2.jpg" },
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG3.jpg" },
    { title: "Test your videogames knowledge on this following quiz!", bgImg: "/assets/discovery/CardBG.jpg" }
  ]

  const featuredKahoots: DiscoverFeaturedCardInfo[] = kahoots.map(kahoot => ({
    ...kahoot,
    numberOfQuestions: Math.floor(Math.random() * 5) + 8
  }))

  return (
    <div className="pr-10">
      <SectionTitle size={SectionTitleSizes.SMALL}>Recently played</SectionTitle>
      <DiscoverKahootWrapper>
        {kahoots.map((kahoot: DiscoverKahootCardInfo, i: number) => (
          <DiscoverKahootCard
            key={i}
            cardSize={DiscoverKahootCardSize.SMALL}
            kahoot={kahoot}
          />
        ))}
      </DiscoverKahootWrapper>

      <SectionTitle size={SectionTitleSizes.SMALL}>Explore by subject</SectionTitle>
      <DiscoverCategoryWrapper>
        {categories.map((category: DiscoverCategoryCardInfo, i: number) => (
          <DiscoverCategoryCard
            key={i}
            cardSize={DiscoverCategoryCardSize.SMALL}
            category={category}
          />
        ))}
      </DiscoverCategoryWrapper>

      <SectionTitle size={SectionTitleSizes.SMALL}>Featured kahoots</SectionTitle>
      <DiscoverFeaturedWrapper>
        {featuredKahoots.map((featuredKahoot: DiscoverFeaturedCardInfo, i: number) => (
          <DiscoverFeaturedCard
            key={i}
            cardSize={DiscoverFeaturedCardSize.MEDIUM}
            featuredKahoot={featuredKahoot}
          />
        ))}
      </DiscoverFeaturedWrapper>
    </div>
  )
}

export default DiscoveryMenuPage;
