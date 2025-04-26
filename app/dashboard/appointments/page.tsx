"use client"

import type React from "react"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Filter,
  MapPin,
  Search,
  Star,
  Video,
  Upload,
  Check,
  AlertCircle,
  Bell,
  Stethoscope,
  Download,
} from "lucide-react"
import { format, addDays } from "date-fns"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Sample data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Surgical Oncology",
    subspecialty: "Melanoma",
    hospital: "City Cancer Institute",
    rating: 4.9,
    reviews: 124,
    experience: 15,
    image: "/placeholder.svg?height=150&width=150",
    availableToday: true,
    nextAvailable: "Today, 2:00 PM",
    consultationFee: 1500,
    location: "Mumbai",
    about:
      "Dr. Sharma is a renowned surgical oncologist specializing in melanoma and other skin cancers. She has performed over 1000 successful surgeries and is known for her patient-centered approach to care.",
    education: [
      "MD in Surgical Oncology, All India Institute of Medical Sciences",
      "Fellowship in Melanoma Surgery, Memorial Sloan Kettering Cancer Center, USA",
    ],
    languages: ["English", "Hindi", "Marathi"],
    telemedicine: true,
  },
  {
    id: 2,
    name: "Dr. Rajiv Mehta",
    specialty: "Medical Oncology",
    subspecialty: "Skin Cancer",
    hospital: "National Cancer Hospital",
    rating: 4.7,
    reviews: 98,
    experience: 12,
    image: "/placeholder.svg?height=150&width=150",
    availableToday: false,
    nextAvailable: "Tomorrow, 10:30 AM",
    consultationFee: 1800,
    location: "Delhi",
    about:
      "Dr. Mehta is a medical oncologist with expertise in treating various types of skin cancers. He specializes in targeted therapies and immunotherapies for advanced skin cancers.",
    education: [
      "MD in Medical Oncology, Tata Memorial Hospital",
      "Research Fellowship in Immunotherapy, MD Anderson Cancer Center, USA",
    ],
    languages: ["English", "Hindi", "Punjabi"],
    telemedicine: true,
  },
  {
    id: 3,
    name: "Dr. Ananya Desai",
    specialty: "Dermatologic Oncology",
    subspecialty: "Basal Cell Carcinoma",
    hospital: "Skin & Cancer Foundation",
    rating: 4.8,
    reviews: 156,
    experience: 10,
    image: "/placeholder.svg?height=150&width=150",
    availableToday: true,
    nextAvailable: "Today, 4:15 PM",
    consultationFee: 1200,
    location: "Bangalore",
    about:
      "Dr. Desai combines expertise in dermatology and oncology to provide comprehensive care for skin cancer patients. She specializes in early detection and non-surgical treatments for basal cell carcinoma.",
    education: [
      "MD in Dermatology, KEM Hospital",
      "Fellowship in Dermatologic Oncology, University of California, San Francisco",
    ],
    languages: ["English", "Hindi", "Kannada", "Gujarati"],
    telemedicine: true,
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialty: "Radiation Oncology",
    subspecialty: "Squamous Cell Carcinoma",
    hospital: "Advanced Cancer Treatment Center",
    rating: 4.6,
    reviews: 87,
    experience: 14,
    image: "/placeholder.svg?height=150&width=150",
    availableToday: false,
    nextAvailable: "Day after tomorrow, 11:00 AM",
    consultationFee: 1600,
    location: "Chennai",
    about:
      "Dr. Singh is a radiation oncologist specializing in the treatment of squamous cell carcinoma and other skin cancers. He is an expert in advanced radiation techniques that minimize damage to surrounding tissues.",
    education: [
      "MD in Radiation Oncology, Christian Medical College",
      "Advanced Training in IMRT and SBRT, Royal Marsden Hospital, UK",
    ],
    languages: ["English", "Hindi", "Tamil"],
    telemedicine: false,
  },
  {
    id: 5,
    name: "Dr. Meera Patel",
    specialty: "Surgical Oncology",
    subspecialty: "Merkel Cell Carcinoma",
    hospital: "Premier Cancer Hospital",
    rating: 4.9,
    reviews: 112,
    experience: 18,
    image: "/placeholder.svg?height=150&width=150",
    availableToday: true,
    nextAvailable: "Today, 1:30 PM",
    consultationFee: 2000,
    location: "Hyderabad",
    about:
      "Dr. Patel is a highly experienced surgical oncologist with special interest in rare skin cancers like Merkel cell carcinoma. She is known for her precision in Mohs surgery and reconstructive techniques.",
    education: [
      "MD in General Surgery, JIPMER",
      "Fellowship in Surgical Oncology, Royal Melbourne Hospital, Australia",
      "Advanced Training in Mohs Surgery, Cleveland Clinic, USA",
    ],
    languages: ["English", "Hindi", "Telugu", "Gujarati"],
    telemedicine: true,
  },
]

// Generate time slots
const generateTimeSlots = (date: Date) => {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    for (const minute of [0, 30]) {
      const slotTime = new Date(date)
      slotTime.setHours(hour, minute, 0, 0)

      // Skip times in the past for today
      if (date.toDateString() === new Date().toDateString() && slotTime < new Date()) {
        continue
      }

      slots.push({
        time: slotTime,
        available: Math.random() > 0.3, // Randomly mark some as unavailable
      })
    }
  }

  return slots
}

// Generate dates for the next 7 days
const generateDates = () => {
  const dates = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i)
    dates.push({
      date,
      slots: generateTimeSlots(date),
    })
  }

  return dates
}

// Generate a unique appointment ID
const generateAppointmentId = () => {
  return "APPT-" + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [onlyTelemedicine, setOnlyTelemedicine] = useState(false)
  const [availableToday, setAvailableToday] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null)
  const [consultationType, setConsultationType] = useState("in-person")
  const [showBookingSuccess, setShowBookingSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [appointmentId, setAppointmentId] = useState("")
  const [patientName, setPatientName] = useState("John Doe") // In a real app, get from user profile
  const [patientEmail, setPatientEmail] = useState("john.doe@example.com") // In a real app, get from user profile
  const [patientPhone, setPatientPhone] = useState("+91 9876543210") // In a real app, get from user profile

  // Generate available dates and time slots
  const availableDates = generateDates()

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter((doctor) => {
    // Search query filter
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.subspecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())

    // Specialty filter
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty

    // Location filter
    const matchesLocation = selectedLocation === "all" || doctor.location === selectedLocation

    // Price range filter
    const matchesPrice = doctor.consultationFee >= priceRange[0] && doctor.consultationFee <= priceRange[1]

    // Telemedicine filter
    const matchesTelemedicine = !onlyTelemedicine || doctor.telemedicine

    // Available today filter
    const matchesAvailability = !availableToday || doctor.availableToday

    return (
      matchesSearch && matchesSpecialty && matchesLocation && matchesPrice && matchesTelemedicine && matchesAvailability
    )
  })

  const handleBookAppointment = () => {
    if (!selectedTimeSlot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a time slot for your appointment.",
      })
      return
    }

    // Generate a unique appointment ID
    const newAppointmentId = generateAppointmentId()
    setAppointmentId(newAppointmentId)

    // Simulate booking process
    setTimeout(() => {
      setShowBookingSuccess(true)
    }, 1000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would upload these files to a server
      // For this demo, we'll just store the file names
      const newFiles = Array.from(e.target.files).map((file) => file.name)
      setUploadedFiles([...uploadedFiles, ...newFiles])

      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${newFiles.length} file(s).`,
      })
    }
  }

  const generateAppointmentPDF = () => {
    if (!selectedDoctor || !selectedTimeSlot) return

    const doc = new jsPDF()

    // Add header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 204)
    doc.text("Carcino AI", 105, 20, { align: "center" })

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Appointment Confirmation", 105, 30, { align: "center" })

    // Add appointment details
    doc.setFontSize(12)
    doc.text(`Appointment ID: ${appointmentId}`, 20, 45)
    doc.text(`Date: ${format(selectedTimeSlot, "EEEE, MMMM d, yyyy")}`, 20, 55)
    doc.text(`Time: ${format(selectedTimeSlot, "h:mm a")}`, 20, 65)
    doc.text(`Type: ${consultationType === "telemedicine" ? "Telemedicine" : "In-Person"}`, 20, 75)

    // Add doctor details
    doc.setFontSize(14)
    doc.text("Doctor Details", 20, 90)
    doc.setFontSize(12)
    doc.text(`Name: ${selectedDoctor.name}`, 20, 100)
    doc.text(`Specialty: ${selectedDoctor.specialty} (${selectedDoctor.subspecialty})`, 20, 110)
    doc.text(`Hospital: ${selectedDoctor.hospital}`, 20, 120)
    doc.text(`Location: ${selectedDoctor.location}`, 20, 130)

    // Add patient details
    doc.setFontSize(14)
    doc.text("Patient Details", 20, 150)
    doc.setFontSize(12)
    doc.text(`Name: ${patientName}`, 20, 160)
    doc.text(`Email: ${patientEmail}`, 20, 170)
    doc.text(`Phone: ${patientPhone}`, 20, 180)

    // Add payment details
    doc.setFontSize(14)
    doc.text("Payment Details", 20, 200)
    doc.setFontSize(12)
    doc.text(`Consultation Fee: ₹${selectedDoctor.consultationFee}`, 20, 210)

    if (consultationType === "telemedicine") {
      doc.text(`Platform Fee: ₹100`, 20, 220)
      doc.text(`Total Amount: ₹${selectedDoctor.consultationFee + 100}`, 20, 230)
    } else {
      doc.text(`Total Amount: ₹${selectedDoctor.consultationFee}`, 20, 220)
    }

    // Add instructions
    doc.setFontSize(14)
    doc.text("Instructions", 20, 245)
    doc.setFontSize(10)

    if (consultationType === "telemedicine") {
      doc.text("1. You will receive a link to join the video consultation 15 minutes before the appointment.", 20, 255)
      doc.text("2. Ensure you have a stable internet connection and a quiet environment.", 20, 265)
      doc.text("3. Keep your medical records and any questions ready for the consultation.", 20, 275)
    } else {
      doc.text("1. Please arrive 15 minutes before your appointment time.", 20, 255)
      doc.text("2. Bring your ID proof and any relevant medical records.", 20, 265)
      doc.text(`3. Hospital Address: ${selectedDoctor.hospital}, ${selectedDoctor.location}`, 20, 275)
    }

    // Add footer
    doc.setFontSize(10)
    doc.text("For any queries, please contact support@carcinoai.com", 105, 290, { align: "center" })

    // Save the PDF
    doc.save(`Appointment_${appointmentId}.pdf`)

    toast({
      title: "PDF Generated",
      description: "Appointment details have been downloaded as a PDF.",
    })
  }

  const addToGoogleCalendar = () => {
    if (!selectedDoctor || !selectedTimeSlot) return

    // Format the date for Google Calendar
    const startTime = selectedTimeSlot.toISOString().replace(/-|:|\.\d+/g, "")
    const endTime = new Date(selectedTimeSlot.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d+/g, "")

    // Create the event details
    const eventDetails = {
      action: "TEMPLATE",
      text: `Appointment with ${selectedDoctor.name}`,
      dates: `${startTime}/${endTime}`,
      details: `
        Appointment ID: ${appointmentId}
        Doctor: ${selectedDoctor.name}
        Specialty: ${selectedDoctor.specialty} (${selectedDoctor.subspecialty})
        Type: ${consultationType === "telemedicine" ? "Telemedicine" : "In-Person"}
        ${
          consultationType === "telemedicine"
            ? "You will receive a link to join the video consultation 15 minutes before the appointment."
            : `Location: ${selectedDoctor.hospital}, ${selectedDoctor.location}`
        }
      `,
      location:
        consultationType === "telemedicine"
          ? "Online Video Consultation"
          : `${selectedDoctor.hospital}, ${selectedDoctor.location}`,
    }

    // Construct the Google Calendar URL
    const googleCalendarUrl = `https://www.google.com/calendar/render?${Object.entries(eventDetails)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")}`

    // Open the Google Calendar in a new tab
    window.open(googleCalendarUrl, "_blank")

    toast({
      title: "Added to Calendar",
      description: "Appointment has been added to your Google Calendar.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Oncologist Appointments</h2>
          <p className="text-muted-foreground">Find and schedule consultations with specialized skin cancer doctors</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminders
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            My Appointments
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors, specialties, or hospitals..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Surgical Oncology">Surgical Oncology</SelectItem>
                  <SelectItem value="Medical Oncology">Medical Oncology</SelectItem>
                  <SelectItem value="Dermatologic Oncology">Dermatologic Oncology</SelectItem>
                  <SelectItem value="Radiation Oncology">Radiation Oncology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <Label className="mb-2 block">Price Range (₹)</Label>
              <Slider value={priceRange} min={0} max={5000} step={100} onValueChange={setPriceRange} className="py-4" />
              <div className="flex items-center justify-between text-sm">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="telemedicine" checked={onlyTelemedicine} onCheckedChange={setOnlyTelemedicine} />
                <Label htmlFor="telemedicine">Telemedicine Only</Label>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="available-today" checked={availableToday} onCheckedChange={setAvailableToday} />
                <Label htmlFor="available-today">Available Today</Label>
              </div>

              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Listing */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Found
          </h3>

          {filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id}>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 bg-muted p-4 flex items-center justify-center">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="h-32 w-32 rounded-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold">{doctor.name}</h3>
                            <p className="text-muted-foreground">
                              {doctor.specialty} • {doctor.subspecialty}
                            </p>
                            <p className="text-sm">{doctor.hospital}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-medium">{doctor.rating}</span>
                            <span className="ml-1 text-sm text-muted-foreground">({doctor.reviews})</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {doctor.experience} years exp.
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {doctor.location}
                          </Badge>
                          {doctor.telemedicine && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Telemedicine
                            </Badge>
                          )}
                          <Badge variant="outline">₹{doctor.consultationFee}</Badge>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Next Available</p>
                            <p
                              className={`text-sm ${doctor.availableToday ? "text-green-600" : "text-muted-foreground"}`}
                            >
                              {doctor.nextAvailable}
                            </p>
                          </div>
                          <Button onClick={() => setSelectedDoctor(doctor)}>Book Appointment</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Appointment Booking Section */}
        <div>
          {selectedDoctor ? (
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Book an Appointment</CardTitle>
                  <CardDescription>with {selectedDoctor.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedDoctor.image || "/placeholder.svg"}
                      alt={selectedDoctor.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{selectedDoctor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedDoctor.specialty} • {selectedDoctor.subspecialty}
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">
                          {selectedDoctor.rating} ({selectedDoctor.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Consultation Type</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="in-person"
                          value="in-person"
                          checked={consultationType === "in-person"}
                          onChange={() => setConsultationType("in-person")}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="in-person" className="text-sm font-normal">
                          In-Person
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="telemedicine"
                          value="telemedicine"
                          checked={consultationType === "telemedicine"}
                          onChange={() => setConsultationType("telemedicine")}
                          className="h-4 w-4"
                          disabled={!selectedDoctor.telemedicine}
                        />
                        <Label
                          htmlFor="telemedicine"
                          className={`text-sm font-normal ${!selectedDoctor.telemedicine ? "text-muted-foreground" : ""}`}
                        >
                          Telemedicine
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableDates.slice(0, 4).map((dateObj, index) => (
                        <Button
                          key={index}
                          variant={selectedDate?.toDateString() === dateObj.date.toDateString() ? "default" : "outline"}
                          className="flex flex-col h-auto py-2"
                          onClick={() => setSelectedDate(dateObj.date)}
                        >
                          <span className="text-xs">{format(dateObj.date, "EEE")}</span>
                          <span className="text-lg font-bold">{format(dateObj.date, "d")}</span>
                          <span className="text-xs">{format(dateObj.date, "MMM")}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Time</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedDate &&
                        availableDates
                          .find((d) => d.date.toDateString() === selectedDate.toDateString())
                          ?.slots.slice(0, 8)
                          .map((slot, index) => (
                            <Button
                              key={index}
                              variant={selectedTimeSlot?.getTime() === slot.time.getTime() ? "default" : "outline"}
                              disabled={!slot.available}
                              className={cn("text-sm", !slot.available && "opacity-50 cursor-not-allowed")}
                              onClick={() => setSelectedTimeSlot(slot.time)}
                            >
                              {format(slot.time, "h:mm a")}
                            </Button>
                          ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Medical Records (Optional)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 10MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileUpload} />
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Uploaded Files:</p>
                        <ul className="text-sm text-muted-foreground">
                          {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-500" />
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between">
                      <span>Consultation Fee</span>
                      <span>₹{selectedDoctor.consultationFee}</span>
                    </div>
                    {consultationType === "telemedicine" && (
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Platform Fee</span>
                        <span>₹100</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>₹{selectedDoctor.consultationFee + (consultationType === "telemedicine" ? 100 : 0)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button className="w-full" onClick={handleBookAppointment}>
                    Confirm Appointment
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedDoctor(null)}>
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Details</CardTitle>
                  <CardDescription>Select a doctor to view details and book an appointment</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <Stethoscope className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Doctor Selected</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose a doctor from the list to view their details and available appointment slots
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Booking Success Dialog */}
      <Dialog open={showBookingSuccess} onOpenChange={setShowBookingSuccess}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Appointment Confirmed!</DialogTitle>
            <DialogDescription>Your appointment has been successfully scheduled</DialogDescription>
          </DialogHeader>

          {selectedDoctor && selectedTimeSlot && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-6">
                {/* Appointment ID */}
                <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  Appointment ID: {appointmentId}
                </div>

                {/* Doctor Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={selectedDoctor.image || "/placeholder.svg"}
                    alt={selectedDoctor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{selectedDoctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(selectedTimeSlot, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{format(selectedTimeSlot, "h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {consultationType === "telemedicine" ? (
                      <>
                        <Video className="h-4 w-4 text-primary" />
                        <span>Telemedicine Consultation</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          {selectedDoctor.hospital}, {selectedDoctor.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Important Information</p>
                    <p className="text-sm text-muted-foreground">
                      {consultationType === "telemedicine"
                        ? "You will receive a video consultation link 15 minutes before the appointment. Please ensure you have a stable internet connection and are in a quiet environment."
                        : "Please arrive 15 minutes before your appointment time. Remember to bring your ID proof and any relevant medical records."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={generateAppointmentPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="w-full" onClick={addToGoogleCalendar}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

