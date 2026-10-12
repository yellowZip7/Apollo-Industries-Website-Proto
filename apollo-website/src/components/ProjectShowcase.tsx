import type { Project } from '../content/projects';

interface ProjectShowcaseProps {
  project: Project;
}

/** A featured project: screenshot in a browser frame, with a short description beside the facts. */
export default function ProjectShowcase({ project }: ProjectShowcaseProps) {
  return (
    <article className="showcase">
      <figure className="showcase__frame">
        <div className="showcase__bar" aria-hidden="true">
          <span className="showcase__dots">
            <span />
            <span />
            <span />
          </span>
          <span className="showcase__address">{project.host}</span>
        </div>
        <img src={project.image} alt={project.imageAlt} width={1600} height={821} loading="lazy" />
      </figure>

      <div className="showcase__info">
        <div>
          <h3 className="showcase__title">{project.name}</h3>
          <p className="showcase__text">{project.summary}</p>
          <span className="tags">
            <span className="tag">{project.kind}</span>
            <span className="tag">Web app</span>
          </span>
        </div>
        <ul className="list showcase__facts">
          {project.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>

      <a className="btn btn--secondary" href={project.url} target="_blank" rel="noopener noreferrer">
        Visit {project.host}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    </article>
  );
}
