import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import WritingLayout from '@/layouts/WritingLayout'
import writingsData from '@/data/writingsData'
import { POSTS_PER_PAGE } from '../../writing'

export async function getStaticPaths() {
  const totalPosts = await getAllFilesFrontMatter('blog')

  const totalPages = Math.ceil(writingsData.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const {
    params: { page },
  } = context
  const posts = await getAllFilesFrontMatter('blog')
  const pageNumber = parseInt(page)
  const displayPosts = writingsData.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      displayPosts,
      pagination,
    },
  }
}

export default function PostPage({ displayPosts, pagination }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <WritingLayout displayPosts={displayPosts} pagination={pagination} title="Published Words" />
    </>
  )
}
