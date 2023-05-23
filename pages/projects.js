import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import writingsData from '@/data/writingsData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'

export default function Projects() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Code Chronicles
          </h1>
          <div className="rounded-lg bg-gray-100 p-4" style={{ maxWidth: '750px' }}>
            <blockquote className="text-lg italic text-gray-800">
              Unveil a hidden chest brimming with enigmatic treasures of the coding realm. Delve
              into a trove of captivating projects that ignite imaginationand challenge conventions.
              Each code snippet holds the potential to unlock boundless possibilities and unravel
              the mysteries of technology. Enter this realm of unknown wonders, where innovation
              awaits your exploration.
            </blockquote>
            <cite className="mt-2 block text-right text-gray-600">
              - ChatGPT description of Code Chronicles
            </cite>
          </div>
        </div>
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
    </>
  )
}
