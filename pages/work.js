import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import writingsData from '@/data/writingsData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'

export default function Work() {
  return (
    <>
      <PageSEO title={`Work - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Work
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            A collection of coding projects and papers.
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Writings
          </h2>
          <div className="container py-12">
            <div className="-m-4 flex flex-wrap">
              {writingsData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((d) => (
                  <Card
                    key={d.title}
                    title={d.title}
                    type={d.type}
                    description={d.description}
                    imgSrc={d.imgSrc}
                    imgAlt={d.imgAlt}
                    href={d.href}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
          <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h2>
          <div className="container py-12">
            <div className="-m-4 flex flex-wrap">
              {projectsData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((d) => (
                  <Card
                    key={d.title}
                    title={d.title}
                    type={d.type}
                    description={d.description}
                    imgSrc={d.imgSrc}
                    imgAlt={d.imgAlt}
                    href={d.href}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
