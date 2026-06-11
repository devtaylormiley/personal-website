export default function RegistrySearch({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`bf-input w-full rounded-lg px-4 py-2.5 text-sm sm:max-w-md ${className}`}
    />
  )
}
