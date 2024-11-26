trigger LoggingEventTrigger on LogEvent__e (after insert) {
    TriggerDispatcher.Run(new LoggingEventTriggerHandler(), Trigger.operationType);
}