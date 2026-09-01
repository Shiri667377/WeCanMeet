import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Availability.css'

import {
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
    const [selectedDates, setSelectedDates] = useState([])

    const [availabilityType, setAvailabilityType] = useState('range')

    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const [showMoreOptions, setShowMoreOptions] = useState(false)

    const [availability, setAvailability] = useState({})
    const [editingRange, setEditingRange] = useState(null)

    const [nameError, setNameError] = useState('')
    const [dateError, setDateError] = useState('')
    const [timeError, setTimeError] = useState('')
    const [saveError, setSaveError] = useState('')

    function clearErrors() {
        setNameError('')
        setDateError('')
        setTimeError('')
        setSaveError('')
    }

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

        setDateError('')
        setTimeError('')
        setSaveError('')
    }

    function isDateSelected(date) {
        const dateKey = getDateKey(date)

        return selectedDates.some(
            (selectedDate) =>
                getDateKey(selectedDate) === dateKey
        )
    }

    function validateAvailability() {
        setTimeError('')

        if (availabilityType === 'range') {
            if (!startTime || !endTime) {
                setTimeError(
                    'Please select a start and end time.'
                )
                return false
            }

            if (startTime >= endTime) {
                setTimeError(
                    'End time must be after start time.'
                )
                return false
            }
        }

        if (availabilityType === 'from') {
            if (!startTime) {
                setTimeError(
                    'Please select a start time.'
                )
                return false
            }
        }

        if (availabilityType === 'until') {
            if (!endTime) {
                setTimeError(
                    'Please select an end time.'
                )
                return false
            }

            if (endTime === '00:00') {
                setTimeError(
                    'Available until 00:00 does not create an available time range.'
                )
                return false
            }
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

    function timeToMinutes(time) {
        const [hours, minutes] = time
            .split(':')
            .map(Number)

        return hours * 60 + minutes
    }

    function getRangeBounds(range) {
        if (range.type === 'allDay') {
            return {
                start: 0,
                end: 24 * 60,
            }
        }

        if (range.type === 'from') {
            return {
                start: timeToMinutes(range.startTime),
                end: 24 * 60,
            }
        }

        if (range.type === 'until') {
            return {
                start: 0,
                end: timeToMinutes(range.endTime),
            }
        }

        return {
            start: timeToMinutes(range.startTime),
            end: timeToMinutes(range.endTime),
        }
    }

    function rangesOverlap(rangeA, rangeB) {
        const a = getRangeBounds(rangeA)
        const b = getRangeBounds(rangeB)

        return (
            a.start < b.end &&
            b.start < a.end
        )
    }

    function addAvailability() {
        setDateError('')
        setTimeError('')
        setSaveError('')

        if (selectedDates.length === 0) {
            setDateError(
                'Please select at least one day.'
            )
            return
        }

        if (!validateAvailability()) {
            return
        }

        const newRange = createRange()

        /*
         * Editing an existing availability
         */
        if (editingRange) {
            const existingRanges =
                availability[editingRange.date] || []

            const hasOverlap = existingRanges.some(
                (range, index) =>
                    index !== editingRange.index &&
                    rangesOverlap(range, newRange)
            )

            if (hasOverlap) {
                setTimeError(
                    'This availability overlaps with another time on this day.'
                )
                return
            }

            setAvailability((current) => {
                const updatedRanges = [
                    ...current[editingRange.date]
                ]

                updatedRanges[editingRange.index] =
                    newRange

                return {
                    ...current,
                    [editingRange.date]:
                        updatedRanges,
                }
            })
        }

        /*
         * Adding availability to one or more days
         */
        else {
            const conflictingDates =
                selectedDates.filter((date) => {
                    const dateKey =
                        getDateKey(date)

                    const existingRanges =
                        availability[dateKey] || []

                    return existingRanges.some(
                        (range) =>
                            rangesOverlap(
                                range,
                                newRange
                            )
                    )
                })

            if (conflictingDates.length > 0) {
                const formattedDates =
                    conflictingDates
                        .map((date) =>
                            date.toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                }
                            )
                        )
                        .join(', ')

                setTimeError(
                    `This availability overlaps with an existing time on: ${formattedDates}.`
                )

                return
            }

            setAvailability((current) => {
                const updatedAvailability = {
                    ...current,
                }

                selectedDates.forEach((date) => {
                    const dateKey =
                        getDateKey(date)

                    updatedAvailability[dateKey] = [
                        ...(updatedAvailability[
                            dateKey
                        ] || []),
                        newRange,
                    ]
                })

                return updatedAvailability
            })
        }

        resetTimeForm()
        setSelectedDates([])
        setDateError('')
        setTimeError('')
    }

    function editAvailability(date, index) {
        const range =
            availability[date][index]

        const [year, month, day] =
            date.split('-')

        const dateObject = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )

        setSelectedDates([dateObject])

        setAvailabilityType(range.type)
        setStartTime(range.startTime || '')
        setEndTime(range.endTime || '')

        setShowMoreOptions(
            range.type !== 'range'
        )

        setEditingRange({
            date,
            index,
        })

        clearErrors()
    }

    function deleteAvailability(date, index) {
        setAvailability((current) => {
            const updatedRanges =
                current[date].filter(
                    (_, rangeIndex) =>
                        rangeIndex !== index
                )

            const updatedAvailability = {
                ...current,
            }

            if (updatedRanges.length === 0) {
                delete updatedAvailability[date]
            } else {
                updatedAvailability[date] =
                    updatedRanges
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

        clearErrors()
    }

    function cancelEdit() {
        resetTimeForm()
        setSelectedDates([])
        clearErrors()
    }

    function saveAvailability(event) {
        event.preventDefault()

        setNameError('')
        setDateError('')
        setTimeError('')
        setSaveError('')

        if (!participantName.trim()) {
            setNameError(
                'Please enter your name.'
            )
            return
        }

        if (
            Object.keys(availability).length === 0
        ) {
            setSaveError(
                'Please add at least one available time.'
            )
            return
        }

        if (editingRange) {
            setTimeError(
                'Please update or cancel your current edit before saving.'
            )
            return
        }

        const hasUnaddedSelection =
            selectedDates.length > 0 &&
            (
                startTime !== '' ||
                endTime !== '' ||
                availabilityType !== 'range'
            )

        if (hasUnaddedSelection) {
            setTimeError(
                'Please add your current availability before saving.'
            )
            return
        }

        const data = {
            participantName:
                participantName.trim(),
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
        const [year, month, day] =
            dateString.split('-')

        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )

        return date.toLocaleDateString(
            'en-US',
            {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        )
    }

    function getSelectionTitle() {
        if (selectedDates.length === 0) {
            return 'Select one or more days'
        }

        if (selectedDates.length === 1) {
            return selectedDates[0]
                .toLocaleDateString(
                    'en-US',
                    {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                    }
                )
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

                    {/* Name */}

                    <div className="form-field">
                        <label htmlFor="participantName">
                            Your name
                        </label>

                        <input
                            id="participantName"
                            type="text"
                            placeholder="Enter your name"
                            value={participantName}
                            onChange={(event) => {
                                setParticipantName(
                                    event.target.value
                                )

                                setNameError('')
                                setSaveError('')
                            }}
                        />

                        {nameError && (
                            <p className="form-error">
                                {nameError}
                            </p>
                        )}
                    </div>

                    <div className="availability-content">

                        {/* Calendar */}

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

                            {dateError && (
                                <p className="form-error availability-field-error">
                                    {dateError}
                                </p>
                            )}
                        </div>

                        {/* Time selection */}

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
                                                    onChange={(event) => {
                                                        setStartTime(
                                                            event.target.value
                                                        )
                                                        setTimeError('')
                                                        setSaveError('')
                                                    }}
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
                                                    onChange={(event) => {
                                                        setEndTime(
                                                            event.target.value
                                                        )
                                                        setTimeError('')
                                                        setSaveError('')
                                                    }}
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
                                                onChange={(event) => {
                                                    setStartTime(
                                                        event.target.value
                                                    )
                                                    setTimeError('')
                                                    setSaveError('')
                                                }}
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
                                                onChange={(event) => {
                                                    setEndTime(
                                                        event.target.value
                                                    )
                                                    setTimeError('')
                                                    setSaveError('')
                                                }}
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
                                                (current) =>
                                                    !current
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
                                                onClick={() => {
                                                    setAvailabilityType('range')
                                                    setTimeError('')
                                                }}
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
                                                onClick={() => {
                                                    setAvailabilityType('from')
                                                    setTimeError('')
                                                }}
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
                                                onClick={() => {
                                                    setAvailabilityType('until')
                                                    setTimeError('')
                                                }}
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
                                                onClick={() => {
                                                    setAvailabilityType('allDay')
                                                    setTimeError('')
                                                }}
                                            >
                                                Available all day
                                            </button>

                                        </div>
                                    )}

                                    {timeError && (
                                        <p className="form-error availability-field-error">
                                            {timeError}
                                        </p>
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
                                            <FiCheck />

                                            {editingRange
                                                ? 'Update availability'
                                                : selectedDates.length > 1
                                                    ? `Add availability to ${selectedDates.length} days`
                                                    : 'Add availability'}
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

                    {/* Saved availability */}

                    {Object.keys(availability).length > 0 && (
                        <div className="availability-summary">

                            <h2>Your selected times</h2>

                            {Object.entries(availability)
                                .sort(
                                    ([dateA], [dateB]) =>
                                        dateA.localeCompare(dateB)
                                )
                                .map(([date, ranges]) => (
                                    <div
                                        className="availability-day"
                                        key={date}
                                    >
                                        <strong className="availability-date">
                                            <FiCalendar />
                                            {formatDate(date)}
                                        </strong>

                                        <div className="availability-ranges">

                                            {ranges.map(
                                                (range, index) => (
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
                                                )
                                            )}

                                        </div>
                                    </div>
                                ))}

                            <div className="availability-actions">

                                {saveError && (
                                    <p className="form-error save-error">
                                        {saveError}
                                    </p>
                                )}

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

                </form>

            </section>
        </main>
    )
}

export default Availability