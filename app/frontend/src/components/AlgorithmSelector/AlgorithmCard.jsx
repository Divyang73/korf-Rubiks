export default function AlgorithmCard({ info }) {
  if (!info) return null

  return (
    <article className="algo-card">
      <h3>{info.full_name}</h3>
      <p>{info.description}</p>
      <ul className="algo-facts">
        <li>Optimal: {info.optimal ? 'Yes' : 'No'}</li>
        <li>Time: {info.time_complexity}</li>
        <li>Space: {info.space_complexity}</li>
        <li>Expected Time: {info.expected_time}</li>
        <li>Memory: {info.memory_usage}</li>
      </ul>
    </article>
  )
}
