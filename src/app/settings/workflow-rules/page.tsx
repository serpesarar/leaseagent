'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Settings, 
  Zap, 
  ArrowRight, 
  Edit, 
  Trash2,
  Play,
  Pause,
  AlertTriangle,
  Clock,
  Mail,
  Bell,
  User
} from 'lucide-react'

// Mock workflow rules data
const mockWorkflowRules = [
  {
    id: '1',
    name: 'Auto-assign Plumbing Issues',
    description: 'Automatically assign high-priority plumbing issues to Elite Plumbing Services',
    isActive: true,
    priority: 10,
    trigger: 'MAINTENANCE_REQUEST_CREATED',
    conditions: {
      category: 'PLUMBING',
      severity: ['HIGH', 'URGENT']
    },
    actions: {
      assignContractor: true,
      contractorName: 'Elite Plumbing Services',
      sendNotification: true,
      escalateIfUnavailable: true
    },
    executionCount: 45,
    lastExecuted: '2024-09-16T10:30:00Z'
  },
  {
    id: '2',
    name: 'Electrical Emergency Response',
    description: 'Immediately assign urgent electrical issues and send alerts',
    isActive: true,
    priority: 15,
    trigger: 'MAINTENANCE_REQUEST_CREATED',
    conditions: {
      category: 'ELECTRICAL',
      severity: 'URGENT'
    },
    actions: {
      assignContractor: true,
      contractorName: 'NYC Electrical Solutions',
      sendNotification: true,
      sendEmail: true,
      escalateIssue: true
    },
    executionCount: 12,
    lastExecuted: '2024-09-15T14:20:00Z'
  },
  {
    id: '3',
    name: 'Late Payment Reminder',
    description: 'Send automatic reminders for payments overdue by 5+ days',
    isActive: true,
    priority: 5,
    trigger: 'PAYMENT_OVERDUE',
    conditions: {
      daysOverdue: 5,
      amount: { min: 100 }
    },
    actions: {
      sendEmail: true,
      sendNotification: true,
      createTask: true
    },
    executionCount: 28,
    lastExecuted: '2024-09-16T09:00:00Z'
  },
  {
    id: '4',
    name: 'Lease Expiring Soon Alert',
    description: 'Notify property managers 60 days before lease expiration',
    isActive: false,
    priority: 3,
    trigger: 'LEASE_EXPIRING',
    conditions: {
      daysBefore: 60
    },
    actions: {
      sendNotification: true,
      sendEmail: true,
      createRenewalTask: true
    },
    executionCount: 8,
    lastExecuted: '2024-09-10T08:00:00Z'
  }
]

const triggerIcons = {
  MAINTENANCE_REQUEST_CREATED: Settings,
  PAYMENT_OVERDUE: AlertTriangle,
  LEASE_EXPIRING: Clock,
  CONTRACTOR_ASSIGNED: User,
  ISSUE_ESCALATED: Zap
}

const actionIcons = {
  assignContractor: User,
  sendNotification: Bell,
  sendEmail: Mail,
  escalateIssue: AlertTriangle,
  createTask: Plus
}

export default function WorkflowRulesPage() {
  const [rules, setRules] = useState(mockWorkflowRules)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Rules</h1>
          <p className="text-gray-600 mt-1">
            Automate your property management tasks with smart rules
          </p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rules.filter(r => r.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.reduce((sum, r) => sum + r.executionCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search workflow rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Workflow Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => {
          const TriggerIcon = triggerIcons[rule.trigger as keyof typeof triggerIcons] || Settings

          return (
            <Card key={rule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <TriggerIcon className={`h-4 w-4 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{rule.name}</span>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">Priority {rule.priority}</Badge>
                      </CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRuleStatus(rule.id)}
                    >
                      {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rule Flow Visualization */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">When:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {rule.trigger.replace('_', ' ')}
                    </Badge>
                    
                    {/* Conditions */}
                    {Object.entries(rule.conditions).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-1">
                        <span>and</span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center my-2">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">Then:</span>
                    {Object.entries(rule.actions).map(([key, value]) => {
                      if (value === true) {
                        const ActionIcon = actionIcons[key as keyof typeof actionIcons] || Settings
                        return (
                          <Badge key={key} variant="outline" className="bg-green-50 text-green-700 flex items-center space-x-1">
                            <ActionIcon className="h-3 w-3" />
                            <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          </Badge>
                        )
                      }
                      if (typeof value === 'string') {
                        return (
                          <Badge key={key} variant="outline" className="bg-green-50 text-green-700">
                            {key}: {value}
                          </Badge>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>

                {/* Execution Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Executed:</span> {rule.executionCount} times
                  </div>
                  <div>
                    <span className="font-medium">Last run:</span> {new Date(rule.lastExecuted).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflow rules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating your first automation rule.'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <Button onClick={() => setShowBuilder(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Rule
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Workflow Builder Modal would go here */}
      {showBuilder && (
        <WorkflowBuilder onClose={() => setShowBuilder(false)} />
      )}
    </div>
  )
}

// Workflow Builder Component
function WorkflowBuilder({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [ruleName, setRuleName] = useState('')
  const [selectedTrigger, setSelectedTrigger] = useState('')
  const [conditions, setConditions] = useState<any>({})
  const [actions, setActions] = useState<any>({})

  const triggers = [
    { id: 'MAINTENANCE_REQUEST_CREATED', name: 'Maintenance Request Created', description: 'When a new maintenance request is submitted' },
    { id: 'PAYMENT_OVERDUE', name: 'Payment Overdue', description: 'When a payment becomes overdue' },
    { id: 'LEASE_EXPIRING', name: 'Lease Expiring', description: 'When a lease is approaching expiration' },
    { id: 'CONTRACTOR_ASSIGNED', name: 'Contractor Assigned', description: 'When a contractor is assigned to a job' }
  ]

  const conditionOptions = {
    MAINTENANCE_REQUEST_CREATED: [
      { key: 'category', label: 'Category', options: ['PLUMBING', 'ELECTRICAL', 'HVAC', 'APPLIANCE'] },
      { key: 'severity', label: 'Severity', options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
      { key: 'estimatedCost', label: 'Estimated Cost', type: 'number' }
    ],
    PAYMENT_OVERDUE: [
      { key: 'daysOverdue', label: 'Days Overdue', type: 'number' },
      { key: 'amount', label: 'Amount', type: 'number' }
    ]
  }

  const actionOptions = [
    { key: 'assignContractor', label: 'Assign Contractor', description: 'Automatically assign to a specific contractor' },
    { key: 'sendNotification', label: 'Send Notification', description: 'Send in-app notification' },
    { key: 'sendEmail', label: 'Send Email', description: 'Send email notification' },
    { key: 'escalateIssue', label: 'Escalate Issue', description: 'Escalate to property manager' },
    { key: 'createTask', label: 'Create Task', description: 'Create a follow-up task' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Workflow Rule</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && <div className="w-12 h-px bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rule Details</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Rule Name</label>
              <Input
                placeholder="e.g., Auto-assign Plumbing Issues"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Trigger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {triggers.map((trigger) => (
                <Card
                  key={trigger.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTrigger === trigger.id ? 'ring-2 ring-primary bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTrigger(trigger.id)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium">{trigger.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{trigger.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Set Conditions</h3>
            {selectedTrigger && conditionOptions[selectedTrigger as keyof typeof conditionOptions] && (
              <div className="space-y-4">
                {conditionOptions[selectedTrigger as keyof typeof conditionOptions].map((condition) => (
                  <div key={condition.key} className="flex items-center space-x-4">
                    <label className="w-32 text-sm font-medium">{condition.label}</label>
                    {condition.options ? (
                      <select
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        onChange={(e) => setConditions({...conditions, [condition.key]: e.target.value})}
                      >
                        <option value="">Select {condition.label}</option>
                        {condition.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={condition.type || 'text'}
                        className="flex-1"
                        placeholder={`Enter ${condition.label.toLowerCase()}`}
                        onChange={(e) => setConditions({...conditions, [condition.key]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Actions</h3>
            <div className="space-y-3">
              {actionOptions.map((action) => (
                <div key={action.key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={action.key}
                    onChange={(e) => setActions({...actions, [action.key]: e.target.checked})}
                  />
                  <div>
                    <label htmlFor={action.key} className="font-medium cursor-pointer">
                      {action.label}
                    </label>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (step === 4) {
                // Save rule
                console.log({ ruleName, selectedTrigger, conditions, actions })
                onClose()
              } else {
                setStep(step + 1)
              }
            }}
          >
            {step === 4 ? 'Create Rule' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}

