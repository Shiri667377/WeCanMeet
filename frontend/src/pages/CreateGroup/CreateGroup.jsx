import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './CreateGroup.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function CreateGroup() {
  const [groupName, setGroupName] = useState('')
  const [meetingDuration, setMeetingDuration] = useState('60')
  const [customDuration, setCustomDuration] = useState('')
  const [customUnit, setCustomUnit] = useState('hours')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    if (!groupName.trim()) {
      setError('Please enter a group name.')
      return
    }

    if (!startDate || !endDate) {
      setError('Please select a date range.')
      return
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date.')
      return
    }

    setError('')

    let durationInMinutes

    if (meetingDuration === 'other') {
      durationInMinutes =
        customUnit === 'hours'
          ? Number(customDuration) * 60
          : Number(customDuration)
    } else {
      durationInMinutes = Number(meetingDuration)
    }

    if (
      meetingDuration === 'other' &&
      (!customDuration || Number(customDuration) <= 0)
    ) {
      setError('Please enter a valid meeting duration.')
      return
    }

    const groupData = {
      name: groupName.trim(),
      meetingDuration: durationInMinutes,
      startDate,
      endDate,
    }

    console.log(groupData)

    navigate('/group/1', {
      state: {
        groupCreated: true,
      },
    })
  }

  return (
    <main className="create-group-page">
      <section className="create-group-card">
        <div className="create-group-header">
          <p className="eyebrow">Create your group</p>
          <h1>Set up your meeting</h1>
          <p className="create-group-description">
            Set the basic details for your meeting.
          </p>
        </div>

        <form className="create-group-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="groupName">Group name</label>
            <input
              id="groupName"
              type="text"
              placeholder="e.g. Study group"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="meetingDuration">Minimum Meeting duration</label>
            <p className="field-help">
              We'll look for time slots that are at least this long.
            </p>

            <select
              id="meetingDuration"
              value={meetingDuration}
              onChange={(event) => setMeetingDuration(event.target.value)}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
              <option value="other">Other...</option>
            </select>

            {meetingDuration === 'other' && (
              <div className="custom-duration">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="Duration"
                  value={customDuration}
                  onChange={(event) => setCustomDuration(event.target.value)}
                />

                <select
                  value={customUnit}
                  onChange={(event) => setCustomUnit(event.target.value)}
                >
                  <option value="hours">Hours</option>
                  <option value="minutes">Minutes</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-field">
            <label>Date range</label>

            <div className="date-range">
              <div className="date-input">
                <label>From</label>

                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date)

                    if (endDate && date > endDate) {
                      setEndDate(null)
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  placeholderText="Select start date"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="date-input">
                <label>To</label>

                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  placeholderText="Select end date"
                  dateFormat="dd/MM/yyyy"
                  disabled={!startDate}
                />
              </div>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <Link to="/" className="secondary-button cancel-link">
              Cancel
            </Link>

            <button type="submit" className="primary-button">
              Create group
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default CreateGroup