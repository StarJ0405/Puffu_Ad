"use client";
import ChildCategory from "@/components/childCategory/childCategory";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import Pstyles from "../../products/products.module.css";
import useNavigate from "@/shared/hooks/useNavigate";
import styles from "./page.module.css";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import FlexChild from "@/components/flex/FlexChild";
import Span from "@/components/span/Span";

function findCategoryById(categories: any[], id: string): any | undefined {
  for (const cat of categories) {
    if (cat.id === id) {
      return cat; // 현재 레벨에서 찾음
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found; // 자식 트리에서 찾음
    }
  }
  return undefined;
}

export function TitleBox({ category_id }: { category_id: any }) {
  const { categoriesData } = useCategories();
  const categoryId = findCategoryById(categoriesData, category_id);

  return (
    <VerticalFlex className={styles.titleBox} alignItems="start">
      <FlexChild className={styles.title} width={"auto"}>
        <h2 className="Wanted">{categoryId.name}</h2>
        <Image src={categoryId.thumbnail} />
      </FlexChild>

      <CategoryMenu categories={categoriesData} categoryId={categoryId} />
    </VerticalFlex>
  );
}

// 카테고리 메뉴
export function CategoryMenu({
  categories,
  categoryId,
}: {
  categories: any;
  categoryId: () => void;
}) {
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("category_id");

  return (
    <FlexChild
      className={Pstyles.category_select}
      onClick={() =>
        NiceModal.show(CategoryModal, { categories, currentCategoryId })
      }
    >
      <P>{categoryId.name}</P>
      <Image
        src={"/resources/icons/arrow/board_arrow_bottom_icon.png"}
        width={12}
      />
    </FlexChild>
  );
}

// 카테고리 메뉴(=> 모달)
const CategoryModal = NiceModal.create(
  ({
    categories,
    currentCategoryId,
  }: {
    categories: any;
    currentCategoryId: string | null;
  }) => {
    const pathname = usePathname();
    const navigate = useNavigate();
    const modal = useModal();

    const orderState = (cat: any) => {
      navigate(`/categories/${cat.id}`);
      modal.remove();
    };

    return (
      <ModalBase
        withHeader
        headerStyle={{
          backgroundColor: "#fff",
          borderBottom: "none",
          color: "#000",
        }}
        borderRadius={10}
        width={"90%"}
        maxWidth={450}
        height={"90lvh"}
        maxHeight={660}
        title={"카테고리 선택"}
        backgroundColor={"#fff"}
        clickOutsideToClose
      >
        <nav className={Pstyles.category_menu}>
          {categories
            .sort((c1: CategoryData, c2: CategoryData) => c1.index - c2.index)
            .map((cat: CategoryData, i: number) => {
              const cat_check =
                pathname === `/categories/${cat.id}` &&
                currentCategoryId === String(cat.id);

              return (
                <VerticalFlex
                  className={clsx(Pstyles.ca_item, cat_check && Pstyles.active)}
                  justifyContent="start"
                  key={i}
                  onClick={() => orderState(cat)}
                >
                  <FlexChild className={Pstyles.ca_img}>
                    <Image src={cat.thumbnail} />
                  </FlexChild>
                  <VerticalFlex className={Pstyles.text_box}>
                    <h5>{cat.name}</h5>
                    <Span className="Wanted">{cat.english_name}</Span>
                  </VerticalFlex>
                </VerticalFlex>
              );
            })}
        </nav>
      </ModalBase>
    );
  }
);
