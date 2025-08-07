"use client";

import { useEffect, useState } from "react"
import DashboardLayout from "../../menu/layout"
import axiosInstance from "@/app/utils/axiosConfig";
import { useParams } from "next/navigation";
import { Category } from "@/app/interfaces/Categories/Category.interface";
import Text from "@/app/components/UIComponents/Text";
import { FontWeights, TextColors, UseCases } from "@/app/interfaces/Text.interface";
import SectionTitle, { SectionTitleSizes } from "@/app/components/utils/Discovery/Titles/SectionTitle";
import DiscoverFeaturedWrapper from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedWrapper";
import DiscoverFeaturedCard, { DiscoverFeaturedCardSize } from "@/app/components/utils/Discovery/Cards/Featured/DiscoverFeaturedCard";
import { DiscoverFeaturedCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/DiscoverFeaturedCardInfo";
import { DiscoverSubsectionClient } from "@/app/interfaces/Kahoot/Dashboard/Discover/Sections/DiscoverSubsectionClient";
import DiscoverKahootWrapper from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootWrapper";
import DiscoverKahootCard, { DiscoverKahootCardSize } from "@/app/components/utils/Discovery/Cards/Kahoots/DiscoverKahootCard";
import { DiscoverKahootCardInfo } from "@/app/interfaces/Kahoot/Dashboard/Discover/RecentlyPlayedKahoots.interface";
import KahootSelectorModal from "@/app/components/utils/Modal/reusable/KahootSelectorModal";
import ResourceNotFound, { ResourceTypes } from "@/app/components/utils/ErrorHandlers/ResourceNotFound";

const CategoryPage = () => {
  const params = useParams();
  let { slug } = params;
  if (Array.isArray(slug)) {
    slug = slug[0];
  }
  const [categoryExists, setCategoryExists] = useState<boolean>(false);
  

  useEffect(() => {
    const initialization = async () => {
      const doesCategoryExists = await verifyIfCategoryExists()
      if (doesCategoryExists) {
        setCategoryExists(true);
      }
    }

    initialization();
  }, []);

  const verifyIfCategoryExists = async (): Promise<boolean> => {
    const categorySlug = slug;
    try {
      await axiosInstance.get(`/category/${categorySlug}`)
      return true;
    } catch (err) {
      return false;
    }
  }

  return (
    <>
      <DashboardLayout>
        {!categoryExists
          ? <ResourceNotFound resourceType={ResourceTypes.CATEGORY} />
          : <PageContent categorySlug={slug} />}
      </DashboardLayout>
    </>
  )
}

interface PageContentProps {
  categorySlug: string;
}

const PageContent = ({ categorySlug }: PageContentProps) => {
  const [category, setCategory] = useState<Category>();
  const [featuredKahoots, setFeaturedKahoots] = useState<DiscoverFeaturedCardInfo[]>([]);
  const [subsections, setSubsections] = useState<DiscoverSubsectionClient[]>([]);

  // Kahoot modal selector
  const [isKahootSelectorModalOpen, setIsKahootSelectorModalOpen] = useState<boolean>(false);
  const [selectedKahootId, setSelectedKahootId] = useState<string | null>(null);
  const handleKahootCardClick = (kahootId: string) => {
    setSelectedKahootId(kahootId);
    setIsKahootSelectorModalOpen(true);
  }

  useEffect(() => {
    getCategoryInfo();
    getFeaturedKahootsFromCategory();
    getSubsectionsFromCategorySlug();
  }, []);

  const getCategoryInfo = async () => {
    await axiosInstance.get(`/category/getCategoryBySlug`, {
      params: {
        categorySlug
      }
    })
      .then(res => {
        setCategory(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getFeaturedKahootsFromCategory = async () => {
    await axiosInstance.get(`/category/getFeaturedKahootsByCategorySlug`, {
      params: {
        categorySlug
      }
    })
      .then(res => {
        setFeaturedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  const getSubsectionsFromCategorySlug = async () => {
    await axiosInstance.get(`/category/getSubsectionsFromCategorySlug`, {
      params: {
        categorySlug
      }
    })
      .then(res => {
        setSubsections(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <>
      <div
        id="category-banner"
        className="w-full h-56 mb-4"
      >
        {category?.mediaUrl
          ? (
            <div className="relative h-full overflow-hidden">
              <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/40" />
              <img
                src={`${category.mediaUrl}`}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="flex justify-center items-center w-full h-full">
                <Text
                  textColor={TextColors.WHITE}
                  useCase={UseCases.BODY}
                  fontWeight={FontWeights.BOLD}
                  className={`absolute z-20 text-4xl text-shadow shadow-black/80`}
                >
                  {category.name}
                </Text>
              </div>
            </div>
          )
          : (
            <div className="w-full h-full bg-kahoot-purple-variant-4 flex justify-center items-center">
              <Text
                fontWeight={FontWeights.BOLD}
                textColor={TextColors.WHITE}
                useCase={UseCases.BODY}
                className="text-5xl"
              >
                {category?.name}
              </Text>
            </div>
          )}
      </div>

      <div id="featured-kahoots-from-category">
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

        {subsections.map((subsection: DiscoverSubsectionClient, index1: number) => (
          <>
            <SectionTitle
              key={index1}
              size={SectionTitleSizes.SMALL}
              viewAll={true}
            >
              {subsection.title}
            </SectionTitle>

            <DiscoverKahootWrapper>
              {subsection.kahoots.map((kahoot: DiscoverKahootCardInfo, index2: number) => (
                <DiscoverKahootCard
                  key={index2}
                  cardSize={DiscoverKahootCardSize.SMALL}
                  kahoot={kahoot}
                  onClick={handleKahootCardClick}
                />
              ))}
            </DiscoverKahootWrapper>
          </>
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

export default CategoryPage;
