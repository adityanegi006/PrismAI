import React from 'react'
import { PIPELINE_NODES } from '../utils/constants'
import styles from './PipelineVisualizer.module.css'

export default function PipelineVisualizer({ activeNode }) {
  return (
    <div className={styles.pipeline}>
      {PIPELINE_NODES.map((node, idx) => (
        <React.Fragment key={node.id}>
          <div className={styles.pipeNode}>
            <div
              className={`${styles.pipeIcon} ${activeNode === idx ? styles.active : ''}`}
            >
              {node.icon}
            </div>
            <span className={styles.pipeLabel}>{node.label}</span>
          </div>

          {idx < PIPELINE_NODES.length - 1 && (
            <div className={styles.pipeArrow} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
