import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import WritingLayout from '@/layouts/WritingLayout'
import writingsData from '@/data/writingsData'
import { PageSEO } from '@/components/SEO'

export const POSTS_PER_PAGE = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const test2 = []
  const test1 = []

  return { props: { test2, test1 } }
}

export default function Writing() {
  const displayPosts = writingsData.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(writingsData.length / POSTS_PER_PAGE),
  }

  return (
    <>
      <PageSEO
        title={`Published Words - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <WritingLayout displayPosts={displayPosts} pagination={pagination} title="Published Words" />
    </>
  )
}
