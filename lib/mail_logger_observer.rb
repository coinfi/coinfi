class MailLoggerObserver
  def self.delivered_email(mail)
    puts "[EMAIL] #{mail.to_s.dump}"
  end
end
