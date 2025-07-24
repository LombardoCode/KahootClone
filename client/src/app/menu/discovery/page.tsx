'use client';

import DiscoverCategoryCard, { DiscoverCategoryCardSize } from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryCard";
import DiscoverCategoryWrapper from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryWrapper";
import DiscoverFeaturedCard, { DiscoverFeaturedCardSize } from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedCard";
import DiscoverFeaturedWrapper from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedWrapper";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootCard";
import DiscoverKahootWrapper from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootWrapper";
import SectionTitle, { SectionTitleSizes } from "@/app/components/utils/Discovery/Titles/SectionTitle";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Discover/RecentlyPlayedKahoots.interface";
import axiosInstance from "@/app/utils/axiosConfig";
import { useEffect, useState } from "react";

export interface DiscoverCategoryCardInfo {
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
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG.jpg" },
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG2.jpg" },
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG3.jpg" },
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG.jpg" },
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG2.jpg" },
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG3.jpg" },
    { kahootId: "", title: "Test your videogames knowledge on this following quiz!", mediaUrl: "/assets/discovery/CardBG.jpg" }
  ]

  const featuredKahoots: DiscoverFeaturedCardInfo[] = kahoots.map(kahoot => ({
    ...kahoot,
    numberOfQuestions: Math.floor(Math.random() * 5) + 8
  }))

  const [recentlyPlayedKahoots, setRecentlyPlayedKahoots] = useState<DiscoverKahootCardInfo[]>([]);

  useEffect(() => {
    getRecentlyPlayedKahoots();
  }, [])

  const getRecentlyPlayedKahoots = async () => {
    console.log(`Recently played kahoots.`);
    axiosInstance.get('/kahoot/getRecentlyPlayedKahoots')
      .then(res => {
        setRecentlyPlayedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <div className="pr-10">
      {recentlyPlayedKahoots.length > 0 && (
        <>
          <SectionTitle size={SectionTitleSizes.SMALL}>Recently played</SectionTitle>
          <DiscoverKahootWrapper>
            {recentlyPlayedKahoots.map((kahoot: DiscoverKahootCardInfo, i: number) => (
              <DiscoverKahootCard
                key={i}
                cardSize={DiscoverKahootCardSize.SMALL}
                kahoot={kahoot}
              />
            ))}
          </DiscoverKahootWrapper>
        </>
      )}

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

      <SectionTitle size={SectionTitleSizes.SMALL}>Teacher's choice</SectionTitle>
      <DiscoverKahootWrapper>
        {kahoots.map((kahoot: DiscoverKahootCardInfo, i: number) => (
          <DiscoverKahootCard
            key={i}
            cardSize={DiscoverKahootCardSize.SMALL}
            kahoot={kahoot}
          />
        ))}
      </DiscoverKahootWrapper>

      <SectionTitle size={SectionTitleSizes.LARGE}>By Educational Level</SectionTitle>
      <SectionTitle size={SectionTitleSizes.SMALL} viewAll={true}>Elementary School</SectionTitle>
      <DiscoverKahootWrapper>
        {kahoots.map((kahoot: DiscoverKahootCardInfo, i: number) => (
          <DiscoverKahootCard
            key={i}
            cardSize={DiscoverKahootCardSize.SMALL}
            kahoot={kahoot}
          />
        ))}
      </DiscoverKahootWrapper>

      <SectionTitle size={SectionTitleSizes.SMALL} viewAll={true}>Middle School</SectionTitle>
      <DiscoverKahootWrapper>
        {kahoots.map((kahoot: DiscoverKahootCardInfo, i: number) => (
          <DiscoverKahootCard
            key={i}
            cardSize={DiscoverKahootCardSize.SMALL}
            kahoot={kahoot}
          />
        ))}
      </DiscoverKahootWrapper>

      <SectionTitle size={SectionTitleSizes.SMALL} viewAll={true}>High School</SectionTitle>
      <DiscoverKahootWrapper>
        {kahoots.map((kahoot: DiscoverKahootCardInfo, i: number) => (
          <DiscoverKahootCard
            key={i}
            cardSize={DiscoverKahootCardSize.SMALL}
            kahoot={kahoot}
          />
        ))}
      </DiscoverKahootWrapper>
    </div>
  )
}

export default DiscoveryMenuPage;
