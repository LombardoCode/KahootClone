'use client';

import DiscoverCategoryCard, { DiscoverCategoryCardSize } from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryCard";
import DiscoverCategoryWrapper from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryWrapper";
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
    </div>
  )
}

export default DiscoveryMenuPage;
