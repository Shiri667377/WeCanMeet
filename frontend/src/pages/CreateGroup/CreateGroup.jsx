import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './CreateGroup.css'

function CreateGroup() {
  const [groupName, setGroupName] = useState('')
  const [creatorName, setCreatorName] = useState('')
  const [meetingDuration, setMeetingDuration] = useState('60')
  const [customDuration, setCustomDuration] = useState('')
  const [customUnit, setCustomUnit] = useState('hours')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [durationError, setDurationError] = useState('')
  const [dateError, setDateError] = useState('')

  const navigate = useNavigate()

  function clearErrors() {
    setDurationError('')
    setDateError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    clearErrors()

    let hasError = false

    if (meetingDuration === 'other') {
      const customValue = Number(customDuration)

      if (
        !customDuration ||
        Number.isNaN(customValue) ||
        customValue <= 0
      ) {
        setDurationError(
          'Please enter a valid meeting duration.'
        )
        hasError = true
      }
    }

    if (!startDate || !endDate) {
      setDateError('Please select a date range.')
      hasError = true
    } else if (endDate < startDate) {
      setDateError(
        'End date cannot be before start date.'
      )
      hasError = true
    }

    if (hasError) {
      return
    }

    let durationInMinutes

    if (meetingDuration === 'other') {
      durationInMinutes =
        customUnit === 'hours'
          ? Number(customDuration) * 60
          : Number(customDuration)
    } else {
      durationInMinutes = Number(meetingDuration)
    }

    const groupData = {
      name: groupName.trim(),
      creatorName: creatorName.trim(),
      meetingDuration: durationInMinutes,
      startDate,
      endDate,
    }

    console.log(groupData)

    // Temporary mock route.
    // The real group ID will come from the backend later.
    navigate('/group/1', {
      state: {
        groupCreated: true,
        group: groupData,
      },
    })
  }

  return (
    <main className="create-group-page">
      <section className="create-group-card">

        <div className="create-group-header">
          <p className="eyebrow">
            Create your group
          </p>

          <h1>Set up your meeting</h1>

          <p className="create-group-description">
            Set the basic details for your meeting.
          </p>
        </div>

        <form
          className="create-group-form"
          onSubmit={handleSubmit}
        >

          {/* Group name */}

          <div className="form-field">
            <label htmlFor="groupName">
              Group name
              <span className="optional-label">
                {' '}(optional)
              </span>
            </label>

            <input
              id="groupName"
              type="text"
              placeholder="e.g. Study group"
              value={groupName}
              onChange={(event) => {
                setGroupName(event.target.value)
              }}
            />
          </div>

          {/* Creator name */}

          <div className="form-field">
            <label htmlFor="creatorName">
              Your name
              <span className="optional-label">
                {' '}(optional)
              </span>
            </label>

            <p className="field-help">
              This lets participants know who created the group.
            </p>

            <input
              id="creatorName"
              type="text"
              placeholder="Enter your name"
              value={creatorName}
              onChange={(event) => {
                setCreatorName(event.target.value)
              }}
            />
          </div>

          {/* Meeting duration */}

          <div className="form-field">
            <label htmlFor="meetingDuration">
              Minimum meeting duration
            </label>

            <p className="field-help">
              We'll look for time slots that are at least this long.
            </p>

            <select
              id="meetingDuration"
              value={meetingDuration}
              onChange={(event) => {
                setMeetingDuration(
                  event.target.value
                )

                setDurationError('')

                if (
                  event.target.value !== 'other'
                ) {
                  setCustomDuration('')
                }
              }}
            >
              <option value="30">
                30 minutes
              </option>

              <option value="45">
                45 minutes
              </option>

              <option value="60">
                1 hour
              </option>

              <option value="90">
                1.5 hours
              </option>

              <option value="120">
                2 hours
              </option>

              <option value="180">
                3 hours
              </option>

              <option value="other">
                Other...
              </option>
            </select>

            {meetingDuration === 'other' && (
              <div className="custom-duration">

                <input
                  type="number"
                  min="0.5"
                  step={
                    customUnit === 'hours'
                      ? '0.5'
                      : '1'
                  }
                  placeholder="Duration"
                  value={customDuration}
                  onChange={(event) => {
                    setCustomDuration(
                      event.target.value
                    )
                    setDurationError('')
                  }}
                />

                <select
                  value={customUnit}
                  onChange={(event) => {
                    setCustomUnit(
                      event.target.value
                    )
                    setDurationError('')
                  }}
                >
                  <option value="hours">
                    Hours
                  </option>

                  <option value="minutes">
                    Minutes
                  </option>
                </select>

              </div>
            )}

            {durationError && (
              <p className="form-error">
                {durationError}
              </p>
            )}
          </div>

          {/* Date range */}

          <div className="form-field">
            <label>Date range</label>

            <div className="date-range">

              <div className="date-input">
                <label>From</label>

                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date)
                    setDateError('')

                    if (
                      endDate &&
                      date > endDate
                    ) {
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
                  onChange={(date) => {
                    setEndDate(date)
                    setDateError('')
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={
                    startDate || new Date()
                  }
                  placeholderText="Select end date"
                  dateFormat="dd/MM/yyyy"
                  disabled={!startDate}
                />
              </div>

            </div>

            {dateError && (
              <p className="form-error">
                {dateError}
              </p>
            )}
          </div>

          {/* Actions */}

          <div className="form-actions">
            <Link
              to="/"
              className="secondary-button cancel-link"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="primary-button"
            >
              Create group
            </button>
          </div>

        </form>

      </section>
    </main>
  )
}

export default CreateGroup