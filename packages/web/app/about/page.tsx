import Image from 'next/image'

import presentations from '@iliazlobin/web/content/presentations.json'
import '@iliazlobin/web/styles/mdx.css'

// import { Config } from 'sst/node/config'

export default async function PresentationsPage() {
  for (const p of presentations) {
    const { title, summary, date, blogPost, googleSlidesUrl } = p
    console.log(title)
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 flex flex-col justify-between">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pb-8 pt-6 md:space-y-4">
            <header>
              <h1 className="font-heading mt-2 scroll-m-20 text-4xl font-bold text-center">
                Ilia Zlobin
              </h1>
              <h2 className="font-heading mt-2 scroll-m-20 text-2xl font-bold text-center">
                Systems Architect (Cloud), SRE/DevOps, AI/ML Engineer,
                ML/LLMOps, Researcher
              </h2>
              <Image
                className="pt-4"
                src="/about-picture.jpg"
                alt="Picture of Ilia Zlobin"
                width={4896}
                height={3268}
              />
            </header>

            <section id="professional-career">
              <h2 className="font-heading scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-8 mb-4">
                Professional Career
              </h2>
              <div className="leading-7 space-y-2">
                <p>
                  An accomplished industry professional with over a decade of
                  experience spanning Cloud Architecture, DevOps, Site
                  Reliability Engineering (SRE), Software Development
                  Engineering (SDE), and AI and MLOps Engineer.
                </p>
                <p>
                  Demonstrated expertise in delivering exceptional results for a
                  diverse clientele of over 30 organizations, leveraging a blend
                  of technical acumen, strategic thinking, and effective
                  leadership.
                </p>
                <p>
                  Continuous pursuit of knowledge and refinement of
                  methodologies has always ensured the successful execution of
                  projects of various complexity. This involves staying
                  up-to-date with the latest technological advancements,
                  regularly attending professional conferences, connecting and
                  communicating with industry professionals, and engaging in
                  hands-on experimentation with emerging tools and techniques.
                  By integrating new insights and best practices into his
                  workflow, he is able to streamline processes, enhance
                  efficiency, and mitigate potential risks, thereby guaranteeing
                  the timely and successful delivery of projects of various
                  types.
                </p>
                <p>
                  Earned certifications from leading industry providers
                  including Amazon Web Services (AWS), Google Cloud Platform
                  (GCP), Microsoft Azure, and Cloud Native Computing Foundation
                  (CNCF), validating proficiency in cloud technologies and best
                  practices.
                </p>
                <p>
                  Actively educates himself about advancments of Machine
                  Learning (ML) and Artificial Intelligence (AI) through
                  rigorous research and development work while reporting about
                  the findings through the series of blog posts and professional
                  YouTube videos
                </p>
              </div>
            </section>

            <section id="research-projects">
              <h2 className="font-heading scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-8 mb-4">
                AI/ML Research Projects
              </h2>
              <ul className="leading-7 space-y-2">
                <li>
                  Conducted in-depth investigations into Fine-Tuned Transformers
                  and Synthetic Machine Learning (SML) models such as Llama,
                  Gemma, Phi, and Mixtral for Grammar correction, documenting
                  findings and methodologies.
                </li>
                <li>
                  Explored the practical applications of DSPy framework,
                  encompassing research, design, architecture, and demonstration
                  of its capabilities in diverse contexts.
                </li>
                <li>
                  Evaluated Visual Language Models (VLM) for image and video
                  analysis, experimenting with different methodologies and
                  presenting insights derived from empirical observations.
                </li>
                <li>
                  Engaged in ongoing studies focused on diffusion models, while
                  also exploring Transfer Learning (TRL), Reinforcement Learning
                  with Human Feedback (RLHF), and efficient model serving
                  strategies such as TGI, Triton, vLLM, Kubeflow, MLFlow, and
                  Kubernetes (K8S)/Ray.
                </li>
                <li>
                  Continuously monitors and reports on the latest developments
                  in the fields of Machine Learning, Artificial Intelligence,
                  and Large Language Models (LLMs), contributing to the
                  dissemination of knowledge within the professional community.
                </li>
              </ul>
            </section>

            <section id="fullstack-development-projects">
              <h2 className="font-heading scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-8 mb-4">
                Full-Stack Development Projects
              </h2>
              <ul className="leading-7 space-y-2">
                <li>
                  Developed and deployed NextJS applications as serverless
                  solutions on Lambda Edge using customized Serverless Stack
                  (SST), sharing insights and tutorials on architecture and
                  implementation.
                </li>
                <li>
                  Created cloud-based blogs summarization solutions using AWS
                  Step Functions and Serverless Stack (SST), optimizing content
                  management processes and enhancing accessibility.
                </li>
                <li>
                  Implemented an innovative Notion to NextJS Blog conversion API
                  with custom authorization mechanisms, facilitating seamless
                  migration and integration of content management systems.
                </li>
              </ul>
            </section>

            <section id="core-skills-and-competency-areas">
              <h2 className="font-heading scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-8 mb-4">
                Core Skills and Competency Areas
              </h2>
              <ul className="leading-7 space-y-2">
                <li>
                  Expertise in Cloud Architecture, including AWS, GCP, and Azure
                  environments.
                </li>
                <li>
                  Proficient in DevOps and Site Reliability Engineering (SRE)
                  methodologies.
                </li>
                <li>
                  Specialized knowledge in Machine Learning Operations (MLOps)
                  and Large Language Model Operations (LLMOps).
                </li>
                <li>
                  Advanced skills in Research and Development (R&D) within the
                  fields of Machine Learning (ML) and Artificial Intelligence
                  (AI).
                </li>
                <li>
                  Strong capabilities in System Design, Optimization, and
                  Technical Leadership.
                </li>
                <li>
                  Extensive experience in Continuous Integration and Continuous
                  Deployment (CI/CD) pipelines.
                </li>
                <li>
                  In-depth understanding of Microservices Architecture and
                  Kubernetes (EKS, K8S) orchestration.
                </li>
                <li>
                  Proficiency in Infrastructure as Code (IaC) frameworks and
                  practices.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
