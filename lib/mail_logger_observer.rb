class MailLoggerObserver
  def self.delivered_email(mail)
    puts mail.to_s.dump
  end
end
