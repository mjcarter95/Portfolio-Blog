import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import projectsData from '@/data/projectsData'
import writingsData from '@/data/writingsData'
import Card from '@/components/Card'

import NewsletterForm from '@/components/NewsletterForm'

const MAX_POST_DISPLAY = 5
const MAX_PROJECT_DISPLAY = 4
const MAX_WRITING_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5" style={{ maxWidth: '600px' }}>
          <div style={{ maxWidth: '500px' }}>
            <p className="text-2xl leading-7 text-gray-500 dark:text-gray-400">
            <span className="font-bold">Hey, I'm Matt</span>. I'm a Postgraduate Researcher in the <span className="font-bold">CDT in Distributed Algorithms</span> at the <span className="font-bold">University of Liverpool</span>.
            </p>
          </div>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 md:mt-16 sm:mt-8">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Featured Writings
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!writingsData.length && 'No writings found.'}
            {writingsData.sort((a, b) => new Date(formatDate(b.date)) - new Date(formatDate(a.date)))
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
                              <Link
                                href={`${href}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {type}
                            </div>
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
          {posts.length > MAX_POST_DISPLAY && (
            <div className="flex justify-end text-base font-medium leading-6">
              <Link
                href="/works"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="all writings"
              >
                All Writings &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 md:mt-16 sm:mt-8">
            Featured Projects
          </h2>
          <div className="container py-12">
            <div className="-m-4 flex flex-wrap">
              {!projectsData.length && 'No projects found.'}
              {projectsData.filter((d) => d.featured === true)
               .sort((a, b) => new Date(formatDate(b.date)) - new Date(formatDate(a.date)))
               .slice(0, MAX_PROJECT_DISPLAY).map((d) => (
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
              href="/work"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="all projects"
            >
              All Projects &rarr;
            </Link>
          </div>
        </div>
      </div>
        {/* <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Photography Feed
        </h2> */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 md:mt-16 sm:mt-8">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              From the Blog
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
