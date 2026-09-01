import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Availability.css'

import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSave,
    FiCheck,
    FiCalendar
} from 'react-icons/fi'

function Availability() {
    const location = useLocation()
    const group = location.state?.group

    const [participantName, setParticipantName] = useState('')

    // Multiple selected days
    const [selectedDates, setSelectedDates] = useState([])

    const [availabilityType, setAvailabilityType] = useState('range')

    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const [showMoreOptions, setShowMoreOptions] = useState(false)

    const [availability, setAvailability] = useState({})
    const [editingRange, setEditingRange] = useState(null)

    const [error, setError] = useState('')

    function getDateKey(date) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    function resetTimeForm() {
        setStartTime('')
        setEndTime('')
        setAvailabilityType('range')
        setShowMoreOptions(false)
        setEditingRange(null)
    }

    function toggleDate(date) {
        // While editing an existing entry,
        // keep its original date selected.
        if (editingRange) {
            return
        }

        const dateKey = getDateKey(date)

        setSelectedDates((current) => {
            const alreadySelected = current.some(
                (selectedDate) =>
                    getDateKey(selectedDate) === dateKey
            )

            if (alreadySelected) {
                return current.filter(
                    (selectedDate) =>
                        getDateKey(selectedDate) !== dateKey
                )
            }

            return [...current, date]
        })

        setError('')
    }

    function isDateSelected(date) {
        const dateKey = getDateKey(date)

        return selectedDates.some(
            (selectedDate) =>
                getDateKey(selectedDate) === dateKey
        )
    }

    function validateAvailability() {
        if (availabilityType === 'range') {
            if (!startTime || !endTime) {
                setError('Please select a start and end time.')
                return false
            }

            if (startTime >= endTime) {
                setError('End time must be after start time.')
                return false
            }
        }

        if (availabilityType === 'from' && !startTime) {
            setError('Please select a start time.')
            return false
        }

        if (availabilityType === 'until' && !endTime) {
            setError('Please select an end time.')
            return false
        }

        return true
    }

    function createRange() {
        if (availabilityType === 'allDay') {
            return {
                type: 'allDay',
            }
        }

        if (availabilityType === 'from') {
            return {
                type: 'from',
                startTime,
            }
        }

        if (availabilityType === 'until') {
            return {
                type: 'until',
                endTime,
            }
        }

        return {
            type: 'range',
            startTime,
            endTime,
        }
    }

    function addAvailability() {
        if (selectedDates.length === 0) {
            setError('Please select at least one day.')
            return
        }

        if (!validateAvailability()) {
            return
        }

        const newRange = createRange()

        // Editing one existing entry
        if (editingRange) {
            setAvailability((current) => {
                const updatedRanges = [
                    ...current[editingRange.date]
                ]

                updatedRanges[editingRange.index] = newRange

                return {
                    ...current,
                    [editingRange.date]: updatedRanges,
                }
            })
        }

        // Adding the same availability to every selected day
        else {
            setAvailability((current) => {
                const updatedAvailability = {
                    ...current,
                }

                selectedDates.forEach((date) => {
                    const dateKey = getDateKey(date)

                    updatedAvailability[dateKey] = [
                        ...(updatedAvailability[dateKey] || []),
                        newRange,
                    ]
                })

                return updatedAvailability
            })
        }

        setError('')
        resetTimeForm()
        setSelectedDates([])
    }

    function editAvailability(date, index) {
        const range = availability[date][index]

        const [year, month, day] = date.split('-')

        const dateObject = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )

        // Editing always works on one entry / one day
        setSelectedDates([dateObject])

        setAvailabilityType(range.type)
        setStartTime(range.startTime || '')
        setEndTime(range.endTime || '')

        if (range.type !== 'range') {
            setShowMoreOptions(true)
        } else {
            setShowMoreOptions(false)
        }

        setEditingRange({
            date,
            index,
        })

        setError('')
    }

    function deleteAvailability(date, index) {
        setAvailability((current) => {
            const updatedRanges = current[date].filter(
                (_, rangeIndex) => rangeIndex !== index
            )

            const updatedAvailability = {
                ...current,
            }

            if (updatedRanges.length === 0) {
                delete updatedAvailability[date]
            } else {
                updatedAvailability[date] = updatedRanges
            }

            return updatedAvailability
        })

        if (
            editingRange?.date === date &&
            editingRange?.index === index
        ) {
            resetTimeForm()
            setSelectedDates([])
        }
    }

    function cancelEdit() {
        resetTimeForm()
        setSelectedDates([])
        setError('')
    }

    function saveAvailability(event) {
        event.preventDefault()

        if (!participantName.trim()) {
            setError('Please enter your name.')
            return
        }

        if (Object.keys(availability).length === 0) {
            setError('Please add at least one available time.')
            return
        }

        setError('')

        const data = {
            participantName: participantName.trim(),
            availability,
        }

        console.log(data)
    }

    function formatRange(range) {
        if (range.type === 'allDay') {
            return 'Available all day'
        }

        if (range.type === 'from') {
            return `Available from ${range.startTime}`
        }

        if (range.type === 'until') {
            return `Available until ${range.endTime}`
        }

        return `${range.startTime} – ${range.endTime}`
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-')

        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )

        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    function getSelectionTitle() {
        if (selectedDates.length === 0) {
            return 'Select one or more days'
        }

        if (selectedDates.length === 1) {
            return selectedDates[0].toLocaleDateString()
        }

        return `${selectedDates.length} days selected`
    }

    return (
        <main className="availability-page">
            <section className="availability-card">

                <div className="availability-header">
                    <p className="eyebrow">
                        Add your availability
                    </p>

                    <h1>When are you free?</h1>

                    <p className="availability-description">
                        Select one or more days and add the times that work for you.
                    </p>
                </div>

                <form onSubmit={saveAvailability}>

                    <div className="form-field">
                        <label htmlFor="participantName">
                            Your name
                        </label>

                        <input
                            id="participantName"
                            type="text"
                            placeholder="Enter your name"
                            value={participantName}
                            onChange={(event) =>
                                setParticipantName(event.target.value)
                            }
                        />
                    </div>

                    <div className="availability-content">

                        <div className="availability-calendar">
                            <h2>Choose days</h2>

                            <DatePicker
                                onChange={toggleDate}
                                minDate={group?.startDate}
                                maxDate={group?.endDate}
                                dayClassName={(date) =>
                                    isDateSelected(date)
                                        ? 'selected-availability-date'
                                        : undefined
                                }
                                inline
                            />
                        </div>

                        <div className="time-selection">

                            <h2>
                                {getSelectionTitle()}
                            </h2>

                            {selectedDates.length > 0 && (
                                <>

                                    {availabilityType === 'range' && (
                                        <div className="time-range">

                                            <div className="time-field">
                                                <label htmlFor="startTime">
                                                    From
                                                </label>

                                                <input
                                                    id="startTime"
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(event) =>
                                                        setStartTime(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="time-field">
                                                <label htmlFor="endTime">
                                                    To
                                                </label>

                                                <input
                                                    id="endTime"
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(event) =>
                                                        setEndTime(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                        </div>
                                    )}

                                    {availabilityType === 'from' && (
                                        <div className="time-field">

                                            <label htmlFor="startTime">
                                                Available from
                                            </label>

                                            <input
                                                id="startTime"
                                                type="time"
                                                value={startTime}
                                                onChange={(event) =>
                                                    setStartTime(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            <p className="availability-help">
                                                From this time until the end of the day.
                                            </p>
                                        </div>
                                    )}

                                    {availabilityType === 'until' && (
                                        <div className="time-field">

                                            <label htmlFor="endTime">
                                                Available until
                                            </label>

                                            <input
                                                id="endTime"
                                                type="time"
                                                value={endTime}
                                                onChange={(event) =>
                                                    setEndTime(
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <p className="availability-help">
                                                From the start of the day until this time.
                                            </p>

                                        </div>
                                    )}

                                    {availabilityType === 'allDay' && (
                                        <p className="all-day-message">
                                            You're available for the entire day.
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        className="more-options-button"
                                        onClick={() =>
                                            setShowMoreOptions(
                                                (current) => !current
                                            )
                                        }
                                    >
                                        {showMoreOptions
                                            ? 'Hide options'
                                            : 'More options'}
                                    </button>

                                    {showMoreOptions && (
                                        <div className="availability-options">

                                            <button
                                                type="button"
                                                className={
                                                    availabilityType === 'range'
                                                        ? 'availability-option active'
                                                        : 'availability-option'
                                                }
                                                onClick={() =>
                                                    setAvailabilityType('range')
                                                }
                                            >
                                                Specific hours
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    availabilityType === 'from'
                                                        ? 'availability-option active'
                                                        : 'availability-option'
                                                }
                                                onClick={() =>
                                                    setAvailabilityType('from')
                                                }
                                            >
                                                Available from
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    availabilityType === 'until'
                                                        ? 'availability-option active'
                                                        : 'availability-option'
                                                }
                                                onClick={() =>
                                                    setAvailabilityType('until')
                                                }
                                            >
                                                Available until
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    availabilityType === 'allDay'
                                                        ? 'availability-option active'
                                                        : 'availability-option'
                                                }
                                                onClick={() =>
                                                    setAvailabilityType('allDay')
                                                }
                                            >
                                                Available all day
                                            </button>

                                        </div>
                                    )}

                                    <div className="time-actions">

                                        <button
                                            type="button"
                                            className={
                                                editingRange
                                                    ? 'update-availability-button'
                                                    : 'add-time-button'
                                            }
                                            onClick={addAvailability}
                                        >
                                            {editingRange ? (
                                                <>
                                                    <FiCheck />
                                                    Update availability
                                                </>
                                            ) : (
                                                <>
                                                    <FiCheck />
                                                    {selectedDates.length > 1
                                                        ? `Add availability to ${selectedDates.length} days`
                                                        : 'Add availability'}
                                                </>
                                            )}
                                        </button>

                                        {editingRange && (
                                            <button
                                                type="button"
                                                className="cancel-edit-button"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        )}

                                    </div>

                                </>
                            )}

                        </div>
                    </div>

                    {Object.keys(availability).length > 0 && (
                        <div className="availability-summary">

                            <h2>Your selected times</h2>

                            {Object.entries(availability).map(
                                ([date, ranges]) => (
                                    <div
                                        className="availability-day"
                                        key={date}
                                    >
                                        <strong className="availability-date">
                                            <FiCalendar />
                                            {formatDate(date)}
                                        </strong>

                                        <div className="availability-ranges">

                                            {ranges.map((range, index) => (
                                                <div
                                                    className="saved-range"
                                                    key={index}
                                                >

                                                    <span>
                                                        {formatRange(range)}
                                                    </span>

                                                    <div className="range-actions">

                                                        <button
                                                            type="button"
                                                            className="edit-range-button"
                                                            onClick={() =>
                                                                editAvailability(
                                                                    date,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FiEdit2 />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-range-button"
                                                            onClick={() =>
                                                                deleteAvailability(
                                                                    date,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <FiTrash2 />
                                                            Delete
                                                        </button>

                                                    </div>

                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                )
                            )}

                            <div className="availability-actions">
                                <button
                                    type="submit"
                                    className="primary-button save-availability-button"
                                >
                                    <FiSave />
                                    Save my availability
                                </button>
                            </div>

                        </div>
                    )}

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                </form>

            </section>
        </main>
    )
}

export default Availability