import Link from '@/components/Link'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'

export default function WritingLayout({ title, displayPosts = [], pagination }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="rounded-lg bg-gray-100 p-4" style={{ maxWidth: '750px' }}>
            <blockquote className="text-lg italic text-gray-800">
              In the realm of Middle-ink, where words wield their power, lies a chronicle of
              &nbsp;published writings, woven with elven eloquence and dwarven craftsmanship,
              &nbsp;to delight the hearts of readers across the lands and beyond.
            </blockquote>
            <cite className="mt-2 block text-right text-gray-600">
              - ChatGPT description of Published Words
            </cite>
          </div>
        </div>
        <ul>
          {!displayPosts.length && 'No writings found.'}
          {displayPosts.map((frontMatter) => {
            const { title, type, date, description, href } = frontMatter
            return (
              <li key={href} className="py-4">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                    <div className="pt-2">
                      <div className="inline-block rounded-lg bg-gray-100 p-2">
                        <p className="inline-block text-sm text-gray-800">{type}</p>
                      </div>
                    </div>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={`${href}`} className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Link>
                      </h3>
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      {description}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          target="writing"
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </>
  )
}
