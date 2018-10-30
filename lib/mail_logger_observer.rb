class MailLoggerObserver
  def self.delivered_email(mail)
    Rails.logger.tagged('EMAIL') do
      Rails.logger.info mail
    end
  end
end
