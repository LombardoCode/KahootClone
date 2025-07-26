'use client';

import DiscoverCategoryCard, { DiscoverCategoryCardSize } from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryCard";
import DiscoverCategoryWrapper from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryWrapper";
import DiscoverFeaturedCard, { DiscoverFeaturedCardSize } from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedCard";
import DiscoverFeaturedWrapper from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedWrapper";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootCard";
import DiscoverKahootWrapper from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootWrapper";
import SectionTitle, { SectionTitleSizes } from "@/app/components/utils/Discovery/Titles/SectionTitle";
import { DiscoverCategoryCardInfo } from "@/app/interfaces/Kahoot/Discover/DiscoverCategoryCardInfo";
import { DiscoverFeaturedCardInfo } from "@/app/interfaces/Kahoot/Discover/DiscoverFeaturedCardInfo";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Discover/RecentlyPlayedKahoots.interface";
import { DiscoverSectionClient } from "@/app/interfaces/Kahoot/Discover/Sections/DiscoverSectionClient";
import { DiscoverSubsectionClient } from "@/app/interfaces/Kahoot/Discover/Sections/DiscoverSubsectionClient";
import axiosInstance from "@/app/utils/axiosConfig";
import { useEffect, useState } from "react";


const DiscoveryMenuPage = () => {
  const [recentlyPlayedKahoots, setRecentlyPlayedKahoots] = useState<DiscoverKahootCardInfo[]>([]);
  const [categories, setCategories] = useState<DiscoverCategoryCardInfo[]>([]);
  const [featuredKahoots, setFeaturedKahoots] = useState<DiscoverFeaturedCardInfo[]>([]);
  const [sections, setSections] = useState<DiscoverSectionClient[]>([]);

  useEffect(() => {
    getRecentlyPlayedKahoots();
    getCategories();
    getFeaturedKahoots();
    getSections();
  }, [])

  const getRecentlyPlayedKahoots = async () => {
    axiosInstance.get('/kahoot/getRecentlyPlayedKahoots')
      .then(res => {
        setRecentlyPlayedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getCategories = async () => {
    axiosInstance.get('/kahoot/getCategories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getFeaturedKahoots = () => {
    axiosInstance.get('/kahoot/getFeaturedKahoots')
      .then(res => {
        setFeaturedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getSections = () => {
    axiosInstance.get('/kahoot/getSections')
      .then(res => {
        setSections(res.data);
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

      {/* Categories */}
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


      {/* Featured kahoots */}
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

      {/* Sections, subsections and it's related kahoots */}
      {sections.map((section: DiscoverSectionClient, index: number) => (
        <div
          id={`section-subsections-and-its-related-kahoots-${index}`}
          className="mt-14"
        >
          <SectionTitle
            key={index}
            size={SectionTitleSizes.LARGE}
            className="mb-2"
          >
            {section.title}
          </SectionTitle>
          
          {section.subsections.map((subsection: DiscoverSubsectionClient, index2: number) => (
            <>
              <SectionTitle
                key={index2}
                size={SectionTitleSizes.SMALL}
                viewAll={true}
              >
                {subsection.title}
              </SectionTitle>
              
              <DiscoverKahootWrapper>
                {subsection.kahoots.map((kahoot: DiscoverKahootCardInfo, index3: number) => (
                  <DiscoverKahootCard
                    key={index3}
                    cardSize={DiscoverKahootCardSize.SMALL}
                    kahoot={kahoot}
                  />
                ))}
              </DiscoverKahootWrapper>
            </>
          ))}
        </div>
      ))}
    </div>
  )
}

export default DiscoveryMenuPage;
