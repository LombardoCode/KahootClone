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
import { DiscoverFeaturedCardInfo } from "@/app/interfaces/Kahoot/Discover/DiscoverFeaturedCardInfo";

const CategoryPage = () => {
  const params = useParams();
  let { slug } = params;
  const [category, setCategory] = useState<Category>();
  const [featuredKahoots, setFeaturedKahoots] = useState<DiscoverFeaturedCardInfo[]>([]);

  useEffect(() => {
    getCategoryInfo();
    getFeaturedKahootsFromCategory();
  }, []);

  const getCategoryInfo = async () => {
    await axiosInstance.get(`/category/getCategoryBySlug`, {
      params: {
        categorySlug: slug
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
        categorySlug: slug
      }
    })
      .then(res => {
        setFeaturedKahoots(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <DashboardLayout>
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
            />
          ))}
        </DiscoverFeaturedWrapper>
      </div>
    </DashboardLayout>
  )
}

export default CategoryPage;
