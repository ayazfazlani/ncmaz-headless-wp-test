import { GetStaticPropsContext } from "next";
import { FaustPage, getNextStaticProps } from "@faustwp/core";
import { gql } from "@/__generated__";
import { PageAuthorBookmarksGetDataQuery } from "@/__generated__/graphql";
import React from "react";
import { FOOTER_LOCATION, PRIMARY_LOCATION } from "@/contains/menu";
import AuthorSaveChild from "@/container/author/AuthorSaveChild";

const Page: FaustPage<PageAuthorBookmarksGetDataQuery> = (props) => {
  return (
    <>
      {/* @ts-ignore */}
      <AuthorSaveChild {...(props || {})} />
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
export function getStaticProps(ctx: GetStaticPropsContext) {
  return getNextStaticProps(ctx, {
    Page,
    revalidate: 900,
  });
}

Page.variables = ({ params }) => {
  return {
    id: params?.slug,
    headerLocation: PRIMARY_LOCATION,
  };
};

Page.query = gql(`
  query PageAuthorBookmarksGetData($id: ID!, $headerLocation: MenuLocationEnum!) {
    user(id: $id, idType: SLUG) {
      ...NcmazFcUserFullFields
    }
    categories(first:10, where: { orderby: COUNT, order: DESC }) {
      nodes {
        ...NcmazFcCategoryFullFieldsFragment
      }
    }
    # common query for all page 
   generalSettings {
      ...NcgeneralSettingsFieldsFragment
    }
    primaryMenuItems: menuItems(where: { location:  $headerLocation  }, first: 80) {
      nodes {
        ...NcPrimaryMenuFieldsFragment
      }
    }
    pages(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        title
        uri
        databaseId
      }
    }
    # end common query for all page
  }
`);

export default Page;
