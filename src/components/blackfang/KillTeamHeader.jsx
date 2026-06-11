import { useRef } from 'react'
import CardImage from '../ui/CardImage'
import ActionButton from '../ui/ActionButton'
import DisplayField from './DisplayField'
import DataslateTextSection from './DataslateTextSection'
import EditableField from './EditableField'
import KillTeamPloysSection from './KillTeamPloysSection'
import { factionImageUrl, killTeamImageUrl } from '../../lib/cardImages'

export default function KillTeamHeader({
  killTeam,
  killteamId,
  factionId,
  imageUrl,
  onFieldChange,
  isDirty,
  officialTeams,
  onCopyFromTeam,
  copyLoading,
  onImageUpload,
  onImageRemove,
  imageUploading,
}) {
  const editable = Boolean(onFieldChange)
  const fileInputRef = useRef(null)
  const teamSrc = killTeamImageUrl(killteamId)
  const factionSrc = factionImageUrl(factionId)
  const bannerSrc = imageUrl || teamSrc

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file && onImageUpload) onImageUpload(file)
  }

  return (
    <section
      className={`bf-killteam-panel w-full min-w-0 overflow-hidden rounded-2xl ${
        editable && isDirty ? 'bf-dirty' : ''
      }`}
    >
      <div className="relative">
        <CardImage
          src={bannerSrc}
          fallbackSrc={factionSrc}
          sources={imageUrl ? [imageUrl, teamSrc, factionSrc] : [teamSrc, factionSrc]}
          alt={killTeam.name}
          aspect="banner"
          badge="Kill team dataslate"
          subtitle={killTeam.archetypes}
        />
        {editable && onImageUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <ActionButton
                label={
                  imageUploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Upload image'
                }
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="bf-btn-ghost rounded-lg bg-[rgb(4_8_6/0.85)] px-3 py-1.5 text-xs font-medium backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-50"
              />
              {imageUrl && onImageRemove && (
                <ActionButton
                  label="Remove"
                  onClick={onImageRemove}
                  disabled={imageUploading}
                  className="bf-btn-danger rounded-lg bg-[rgb(4_8_6/0.85)] px-3 py-1.5 text-xs font-medium backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}
            </div>
          </>
        )}
      </div>

      <div className="w-full min-w-0 p-5 sm:p-8">
        {editable ? (
          <>
            <EditableField
              className="w-full"
              label="Team name"
              value={killTeam.name}
              onChange={(v) => onFieldChange('name', v)}
              inputClassName="text-2xl font-semibold sm:text-3xl"
            />
            {officialTeams?.length > 0 && onCopyFromTeam && (
              <label className="mt-4 block w-full min-w-0">
                <span className="bf-mono-label mb-1 block">Copy from Existing Kill Team</span>
                <select
                  value=""
                  onChange={(e) => {
                    const slug = e.target.value
                    if (slug) onCopyFromTeam(slug)
                  }}
                  disabled={copyLoading}
                  className="bf-field-input w-full text-sm disabled:opacity-50"
                >
                  <option value="">
                    {copyLoading ? 'Loading team data…' : 'Select a kill team…'}
                  </option>
                  {officialTeams.map((team) => (
                    <option key={team.slug} value={team.slug}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </>
        ) : (
          <h2 className="bf-title text-2xl sm:text-3xl">{killTeam.name}</h2>
        )}

        {editable ? (
          <EditableField
            className="mt-6 w-full"
            label="Archetypes"
            value={killTeam.archetypes}
            onChange={(v) => onFieldChange('archetypes', v)}
          />
        ) : (
          <DisplayField className="mt-6 w-full" label="Archetypes" value={killTeam.archetypes} />
        )}

        {editable ? (
          <>
            <EditableField
              className="mt-6 w-full"
              label="Roster note"
              value={killTeam.rosterNote}
              onChange={(v) => onFieldChange('rosterNote', v)}
              multiline
            />
            <EditableField
              className="mt-6 w-full"
              label="Faction rules title"
              value={killTeam.factionRuleName || 'Faction rules'}
              onChange={(v) => onFieldChange('factionRuleName', v)}
            />
            <EditableField
              className="mt-6 w-full"
              label={killTeam.factionRuleName || 'Faction rules'}
              value={killTeam.factionRule}
              onChange={(v) => onFieldChange('factionRule', v)}
              multiline
            />
            <KillTeamPloysSection
              className="mt-6 w-full"
              killTeam={killTeam}
              editable
              onPloysChange={(ploys) => onFieldChange('ploys', ploys)}
            />
          </>
        ) : (
          <>
            <DataslateTextSection
              className="mt-6 w-full"
              title="Roster note"
              content={killTeam.rosterNote}
            />
            <DataslateTextSection
              className="mt-6 w-full"
              title={killTeam.factionRuleName || 'Faction rules'}
              content={killTeam.factionRule}
            />
            <KillTeamPloysSection className="mt-6 w-full" killTeam={killTeam} />
          </>
        )}
      </div>
    </section>
  )
}
