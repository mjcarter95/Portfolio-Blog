import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import projectsData from '@/data/projectsData'
import writingsData from '@/data/writingsData'
import Card from '@/components/Card'
import axios from 'axios'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'

const MAX_POST_DISPLAY = 5
const MAX_PROJECT_DISPLAY = 4
const MAX_WRITING_DISPLAY = 5
const MAX_PHOTO_DISPLAY = 6

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
  const apiUrl = `https://graph.instagram.com/me/media?fields=id,media_type,permalink,media_url,caption&limit=${MAX_PHOTO_DISPLAY}&access_token=${ACCESS_TOKEN}`

  try {
    const response = await axios.get(apiUrl)
    const insta_posts = response.data.data

    return { props: { posts, instagramPosts: insta_posts } }
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    const insta_posts = []

    return { props: { posts, instagramPosts: insta_posts } }
  }
}

export default function Home({ posts, instagramPosts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-16 pb-12 md:space-y-5" style={{ maxWidth: '600px' }}>
          <div className="pb-2" style={{ maxWidth: '500px' }}>
            <p className="text-2xl leading-7 text-gray-500 dark:text-gray-400">
              <span className="font-bold">Hey, I'm Matt</span> 👋 I'm a Postgraduate Researcher in
              the <span className="font-bold"> CDT in Distributed Algorithms</span> at the
              <span className="font-bold"> University of Liverpool</span> 👨‍🎓
            </p>
          </div>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:mt-16 sm:px-6 md:mt-32 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Published Words
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!writingsData.length && 'No writings found.'}
            {writingsData
              .sort((a, b) => new Date(formatDate(b.date)) - new Date(formatDate(a.date)))
              .slice(0, MAX_WRITING_DISPLAY)
              .map((frontMatter) => {
                const { title, type, date, description, href } = frontMatter
                return (
                  <li key={href} className="py-12">
                    <article>
                      <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time dateTime={date}>{formatDate(date)}</time>
                          </dd>
                        </dl>
                        <div className="space-y-5 xl:col-span-3">
                          <div className="space-y-6">
                            <div>
                              <h2 className="text-2xl font-bold leading-8 tracking-tight">
                                <Link href={`${href}`} className="text-gray-900 dark:text-gray-100">
                                  {title}
                                </Link>
                              </h2>
                              <div className="flex flex-wrap">{type}</div>
                            </div>
                            <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                              {description}
                            </div>
                          </div>
                          <div className="text-base font-medium leading-6">
                            <Link
                              href={`${href}`}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                              aria-label={`Read "${title}"`}
                            >
                              Read more &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
          </ul>
          {writingsData.length > MAX_WRITING_DISPLAY && (
            <div className="flex justify-end text-base font-medium leading-6">
              <Link
                href="/work"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="all writings"
              >
                All Writings &rarr;
              </Link>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:mt-8 sm:px-6 md:mt-16 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Project Spotlight
          </h2>
          <div className="container py-12">
            <div className="-m-4 flex flex-wrap">
              {!projectsData.length && 'No projects found.'}
              {projectsData
                .filter((d) => d.featured === true)
                .sort((a, b) => new Date(formatDate(b.date)) - new Date(formatDate(a.date)))
                .slice(0, MAX_PROJECT_DISPLAY)
                .map((d) => (
                  <Card
                    key={d.title}
                    title={d.title}
                    type={d.type}
                    description={d.description}
                    imgSrc={d.imgSrc}
                    href={d.href}
                  />
                ))}
            </div>
          </div>
          <div className="flex justify-end text-base font-medium leading-6">
            <Link
              href="/projects"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="all projects"
            >
              All Projects &rarr;
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:mt-8 sm:px-6 md:mt-16 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Through the Lens
          </h2>
          <div className="container py-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {!instagramPosts.length && <p>No photos found.</p>}
              {instagramPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-center">
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                    <div className="relative overflow-hidden">
                      <img src={post.media_url} alt={post.caption} className="h-auto w-full" />
                      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black opacity-0 transition duration-300 ease-in-out hover:opacity-50"></div>
                      <div className="left-50 top-50 absolute text-center opacity-0 transition duration-300 ease-in-out hover:opacity-0">
                        {post.caption}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end text-base font-medium leading-6">
            <Link
              href={siteMetadata.instagram}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="all photos"
            >
              All Photos &rarr;
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:mt-8 sm:px-6 md:mt-16 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Mental Meanderings
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_POST_DISPLAY).map((frontMatter) => {
              const { slug, date, title, summary, tags } = frontMatter
              return (
                <li key={slug} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold leading-8 tracking-tight">
                              <Link
                                href={`/blog/${slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base font-medium leading-6">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`Read "${title}"`}
                          >
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {posts.length > MAX_POST_DISPLAY && (
            <div className="flex justify-end text-base font-medium leading-6">
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="all posts"
              >
                All Posts &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
