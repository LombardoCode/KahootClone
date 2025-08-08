'use client';

import Spinner from "@/app/components/UIComponents/Spinners/Spinner";
import DiscoverCategoryCard, { DiscoverCategoryCardSize } from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryCard";
import DiscoverCategoryWrapper from "@/app/components/utils/Discovery/Cards/Categories/DiscoverCategoryWrapper";
import DiscoverFeaturedCard, { DiscoverFeaturedCardSize } from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedCard";
import DiscoverFeaturedWrapper from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedWrapper";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootCard";
import DiscoverKahootWrapper from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootWrapper";
import SectionTitle, { SectionTitleSizes } from "@/app/components/utils/Discovery/Titles/SectionTitle";
import KahootSelectorModal from "@/app/components/utils/Modal/reusable/KahootSelectorModal";
import { DiscoverCategoryCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverCategoryCardInfo";
import { DiscoverFeaturedCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverFeaturedCardInfo";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import { DiscoverSectionClient } from "@/app/interfaces/Kahoot/Dashboard/Discover/Sections/DiscoverSectionClient";
import { DiscoverSubsectionClient } from "@/app/interfaces/Kahoot/Dashboard/Discover/Sections/DiscoverSubsectionClient";
import axiosInstance from "@/app/utils/axiosConfig";
import { useEffect, useState } from "react";


const DiscoveryMenuPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recentlyPlayedKahoots, setRecentlyPlayedKahoots] = useState<DiscoverKahootCardInfo[]>([]);
  const [categories, setCategories] = useState<DiscoverCategoryCardInfo[]>([]);
  const [featuredKahoots, setFeaturedKahoots] = useState<DiscoverFeaturedCardInfo[]>([]);
  const [sections, setSections] = useState<DiscoverSectionClient[]>([]);

  // Kahoot modal selector
  const [isKahootSelectorModalOpen, setIsKahootSelectorModalOpen] = useState<boolean>(false);
  const [selectedKahootId, setSelectedKahootId] = useState<string | null>(null);
  const handleKahootCardClick = (kahootId: string) => {
    setSelectedKahootId(kahootId);
    setIsKahootSelectorModalOpen(true);
  }

  useEffect(() => {
    const getInformation = async () => {
      await getRecentlyPlayedKahoots();
      await getCategories();
      await getFeaturedKahoots();
      await getSections();

      setLoading(false);
    }

    getInformation();
  }, [])

  const getRecentlyPlayedKahoots = async () => {
    await axiosInstance.get('/kahoot/getRecentlyPlayedKahoots')
      .then(res => {
        setRecentlyPlayedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getCategories = async () => {
    await axiosInstance.get('/kahoot/getCategories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getFeaturedKahoots = async () => {
    await axiosInstance.get('/kahoot/getFeaturedKahoots')
      .then(res => {
        setFeaturedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getSections = async () => {
    await axiosInstance.get('/kahoot/getSections')
      .then(res => {
        setSections(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner className="text-kahoot-purple-variant-3" />
      </div>
    )
  }

  return (
    <>
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
                  onClick={handleKahootCardClick}
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
              onClick={handleKahootCardClick}
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
                      onClick={handleKahootCardClick}
                    />
                  ))}
                </DiscoverKahootWrapper>
              </>
            ))}
          </div>
        ))}
      </div>
      
      <KahootSelectorModal
        isOpen={isKahootSelectorModalOpen}
        onClose={() => {
          setIsKahootSelectorModalOpen(false);
          setSelectedKahootId(null);
        }}
        selectedKahootId={selectedKahootId}
      />
    </>
  )
}

export default DiscoveryMenuPage;
